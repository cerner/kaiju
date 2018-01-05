require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe Project do
    # before(:context) do
    #   @project_key = 'idk'
    #   @project = project.new(idk)
    # end
    context 'initialization' do
      # after(:example) do
      #   @project.redis.del(@project.redis_objects.keys.map { |k| @project.send(k) }.reject(&:nil?).map(&:key))
      # end
      it 'should initialize a project object with a predefined id' do
        id = 'unique'
        @project = Project.new(id)
        expect(@project.id).to eq(id)
      end
    end
    context 'as_json' do
      before(:example) do
        @id = 'unique'
        @project = Project.new(@id)

        @creation_date_time = 'creation_date_time'
        @project.creation_date_time = @creation_date_time

        @update_date_time = 'update_date_time'
        @project.update_date_time = @update_date_time

        @owner = 'owner'
        @project.owner = 'owner'

        @name = 'name'
        @project.name = @name

        @workspace1 = 'workspace1'
        @workspace2 = 'workspace2'
        @project.workspaces << @workspace1
        @project.workspaces << @workspace2

        @collaborator1 = 'collaborator1'
        @collaborator2 = 'collaborator2'
        @project.collaborators << @collaborator1
        @project.collaborators << @collaborator2
      end
      after(:example) do
        @project.redis.del(@project.redis_objects.keys.map { |k| @project.send(k) }.reject(&:nil?).map(&:key))
      end
      it 'should fetch all objects' do
        project_hash = @project.as_json
        expect(project_hash['id']).to eq(@id)
        expect(project_hash['creation_date_time']).to eq(@creation_date_time)
        expect(project_hash['update_date_time']).to eq(@update_date_time)
        expect(project_hash['owner']).to eq(@owner)
        expect(project_hash['name']).to eq(@name)
        expect(project_hash['workspaces']).to eq([@workspace1, @workspace2])
        expect(project_hash['collaborators']).to include(@collaborator1, @collaborator2)
      end
    end

    context 'editors' do
      it 'returns the owner and empty contributors' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(project.editors).to eq([user.id])
        project.destroy
        user.destroy
      end

      it 'returns the owner and collaborators' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.collaborators << 'derpface'
        expect(project.editors).to eq(['derpface', user.id])
        project.destroy
        user.destroy
      end
    end

    context 'add_collaborators' do
      it 'rejects an invitation by a non editor' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.add_collaborators('derpface', ['old-man'])
        expect(project.collaborators).to eq([])
        project.destroy
        user.destroy
      end

      it 'adds a collaborator' do
        ComponentInformationSpecHelper.reset_component_information([])
        user = Kaiju::UserFactory.new_user('owner')
        old_man_user = Kaiju::UserFactory.new_user('old-man')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.add_collaborators(user.id, [old_man_user.id])
        expect(project.collaborators).to eq([old_man_user.id])
        expect(workspace.collaborators).to eq([old_man_user.id])
        expect(old_man_user.shared_projects).to eq([project.id])
        workspace.destroy
        project.destroy
        user.destroy
        old_man_user.destroy
      end
    end

    context 'add_workspace' do
      it 'sets up state on the project and added workspace' do
        ComponentInformationSpecHelper.reset_component_information([])
        user = Kaiju::UserFactory.new_user('owner')
        collaborator = Kaiju::UserFactory.new_user('collaborator')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.add_collaborators(user.id, [collaborator.id])
        project.add_workspace(user.id, workspace)
        expect(project.workspaces.value).to include(workspace.id)
        expect(workspace.projects.value).to include(project.id)
        expect(workspace.collaborators.value).to include(collaborator.id)
        workspace.destroy
        project.destroy
        user.destroy
        collaborator.destroy
      end
    end

    context 'valid_object' do
      it 'nulls a id that cannot be found' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.owner = 'derp'
        expect(User.valid_object(project.owner, &:id)).to be_nil
        expect(project.owner).to be_nil
        project.destroy
        user.destroy
      end

      it 'executes a block for a non nil value' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(User.valid_object(project.owner, &:id)).to eq(user.id)
        expect(project.owner.value).to eq(user.id)
        project.destroy
        user.destroy
      end

      it 'returns the object if valid and no block given' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(User.valid_object(project.owner).id).to eq(user.id)
        expect(project.owner.value).to eq(user.id)
        project.destroy
        user.destroy
      end
    end

    context 'valid_objects' do
      it 'removes ids that cannot be found' do
        ComponentInformationSpecHelper.reset_component_information([])
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.workspaces << 'junk'
        valid_objects = Workspace.valid_objects(project.workspaces)
        expect(valid_objects.count).to eq(1)
        expect(valid_objects[0].id).to eq(workspace.id)
        expect(project.workspaces.value).to eq([workspace.id])
        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'executes a block for each object' do
        ComponentInformationSpecHelper.reset_component_information([])
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.workspaces << 'junk'
        valid_objects = Workspace.valid_objects(project.workspaces, &:id)
        expect(valid_objects).to eq([workspace.id])
        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'allows a block to exclude items' do
        ComponentInformationSpecHelper.reset_component_information([])
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.workspaces << 'junk'
        valid_objects = Workspace.valid_objects(project.workspaces) { |_object| nil }
        expect(valid_objects).to eq([])
        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'works for sets too' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.collaborators << user.id
        project.collaborators << 'junk'
        valid_objects = User.valid_objects(project.collaborators, &:id)
        expect(valid_objects).to eq([user.id])
        project.destroy
        user.destroy
      end
    end

    context 'inactive?' do
      it 'returns false if inactive was never set' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(project.inactive?).to be false
        project.destroy
        user.destroy
      end

      it 'returns true if inactive was set' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.inactivate
        expect(project.inactive?).to be true
        project.destroy
        user.destroy
      end

      it 'returns false if activate was set' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project.inactivate
        project.activate
        expect(project.inactive?).to be false
        project.destroy
        user.destroy
      end
    end

    context 'json_representation' do
      it 'returns a hash of member objects' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(project.json_representation).to eq(
          'id' => project.id,
          'creation_date_time' => project.creation_date_time.value,
          'update_date_time' => project.update_date_time.value,
          'owner' => project.owner.value,
          'name' => project.name.value,
          'type' => project_type,
          'workspaces' => project.workspaces.value,
          'collaborators' => project.collaborators.value,
          'inactive' => project.inactive.value
        )
        project.destroy
        user.destroy
      end

      it 'allows exceptions' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        expect(project.json_representation(except: %i[name collaborators])).to eq(
          'id' => project.id,
          'creation_date_time' => project.creation_date_time.value,
          'update_date_time' => project.update_date_time.value,
          'owner' => project.owner.value,
          'workspaces' => project.workspaces.value,
          'inactive' => project.inactive.value,
          'type' => project.type.value
        )
        project.destroy
        user.destroy
      end
    end

    context 'inactivate' do
      it 'sets inactive true and inactivates child workspaces' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.inactivate
        expect(project.inactive.value).to be true
        expect(project.ttl).to be_within(5).of(30.days)
        expect(workspace.inactive?).to be true
        workspace.destroy
        project.destroy
        user.destroy
      end
    end

    context 'activate' do
      it 'sets inactive false and activates child workspaces' do
        user = Kaiju::UserFactory.new_user('owner')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)
        project.workspaces << workspace.id
        project.inactivate
        project.activate
        expect(project.inactive.value).to be false
        expect(project.ttl).to eq(-1)
        expect(workspace.inactive?).to be false
        workspace.destroy
        project.destroy
        user.destroy
      end
    end
  end
end
