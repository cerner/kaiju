require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe UserJson do
    before(:context) do
    end
    context 'users_as_json' do
      it 'should return json for the list of users' do
        user_a = UserFactory.new_user('userA', 'userA')
        user_b = UserFactory.new_user('userB', 'userB')

        expected_result = [
          {
            'id' => user_b.id,
            'url' => 'https://herp/users/' + user_b.id,
            'name' => user_b.name.value,
            'changelog_viewed' => false
          },
          {
            'id' => user_a.id,
            'url' => 'https://herp/users/' + user_a.id,
            'name' => user_a.name.value,
            'changelog_viewed' => false
          }
        ]

        json = UserJson.users_as_json('https://herp')
        expect(json).to include(expected_result[0])
        expect(json).to include(expected_result[1])
        user_a.destroy
        user_b.destroy
      end
    end

    context 'as_json' do
      it 'returns a json representation of a user' do
        user = Kaiju::UserFactory.new_user('owner', 'name', 'email', 'nickname')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)

        project.add_workspace(user.id, workspace)
        user.shared_projects << project.id
        user.add_recent_workspace(project.id, workspace.id)
        base_url = 'base_url'
        json = UserJson.as_json(user.id, base_url)
        expect(json).to eq(
          'id' => user.id,
          'creation_date_time' => user.creation_date_time.value,
          'email' => user.email.value,
          'name' => user.name.value,
          'recent_workspaces' => [{
            'project' => ProjectJson.as_json(project.id, base_url, lite: true),
            'workspace' => Kaiju::WorkspaceJson.as_json(workspace.id, base_url, project_id: project.id, lite: true)
          }],
          'projects' => [ProjectJson.as_json(project.id, base_url, lite: true)],
          'shared_projects' => [ProjectJson.as_json(project.id, base_url, lite: true)],
          'inactive_projects' => [],
          'url' => base_url + '/users/' + user.id,
          'projects_url' => base_url + '/users/' + user.id + '/projects',
          'changelog_viewed' => false
        )

        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'returns inactive_projects' do
        user = Kaiju::UserFactory.new_user('owner', 'name', 'email', 'nickname')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        inactive_project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        inactive_project.inactivate
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, project_type)

        project.add_workspace(user.id, workspace)
        user.shared_projects << project.id
        user.add_recent_workspace(project.id, workspace.id)
        base_url = 'base_url'
        json = UserJson.as_json(user.id, base_url)
        expect(json).to eq(
          'id' => user.id,
          'creation_date_time' => user.creation_date_time.value,
          'email' => user.email.value,
          'name' => user.name.value,
          'recent_workspaces' => [{
            'project' => ProjectJson.as_json(project.id, base_url, lite: true),
            'workspace' => Kaiju::WorkspaceJson.as_json(workspace.id, base_url, project_id: project.id, lite: true)
          }],
          'projects' => [ProjectJson.as_json(project.id, base_url, lite: true)],
          'shared_projects' => [ProjectJson.as_json(project.id, base_url, lite: true)],
          'inactive_projects' => [ProjectJson.as_json(inactive_project.id, base_url, lite: true, inactive: true)],
          'url' => base_url + '/users/' + user.id,
          'projects_url' => base_url + '/users/' + user.id + '/projects',
          'changelog_viewed' => false
        )

        workspace.destroy
        project.destroy
        inactive_project.destroy
        user.destroy
      end

      it 'returns a sorted list of projects' do
        user = Kaiju::UserFactory.new_user('owner', 'name', 'email', 'nickname')

        project1 = Kaiju::ProjectFactory.new_project(user.id, 'blarg')
        project1.name = 'C'

        project2 = Kaiju::ProjectFactory.new_project(user.id, 'blarg')
        project2.name = 'A'

        project3 = Kaiju::ProjectFactory.new_project(user.id, 'blarg')
        project3.name = 'B'

        puts UserJson.as_json(user.id, 'base_url')['projects']
        expect(UserJson.as_json(user.id, 'base_url')['projects']).to eq(
          [
            ProjectJson.as_json(project2.id, 'base_url', lite: true),
            ProjectJson.as_json(project3.id, 'base_url', lite: true),
            ProjectJson.as_json(project1.id, 'base_url', lite: true)
          ]
        )

        project1.destroy
        project2.destroy
        project3.destroy
        user.destroy
      end
    end
  end
end
