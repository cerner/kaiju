require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe ProjectJson do
    before(:context) do
    end
    context 'projects_to_json' do
      it 'should return json for the list of components' do
        user = Kaiju::UserFactory.new_user('oog', 'derpface')
        project_type = 'blarg'
        project_a = Kaiju::ProjectFactory.new_project(user.id, project_type)
        project_b = Kaiju::ProjectFactory.new_project(user.id, project_type)

        base_url = 'https://herp'

        expected_url_a = base_url + '/projects/' + project_a.id
        expected_url_b = base_url + '/projects/' + project_b.id

        expected_result_a = {
          'id' => project_b.id,
          'url' => expected_url_b,
          'workspaces_url' => expected_url_b + '/workspaces',
          'reference_components_url' => expected_url_b + '/reference_components',
          'rename_url' => expected_url_b + '/name',
          'changelog_viewed' => expected_url_b + '/changelog_viewed',
          'collaboration_invitation_url' => expected_url_b + '/collaboration_invitation',
          'activate_url' => expected_url_b + '/activate',
          'name' => project_b.name.value,
          'type' => project_type,
          'owner' => {
            'id' => user.id,
            'url' => base_url + '/users/' + user.id,
            'name' => user.name.value,
            'changelog_viewed' => false
          },
          'update_date_time' => project_b.update_date_time.value,
          'workspace_count' => project_b.workspaces.count
        }
        expected_result_b = {
          'id' => project_a.id,
          'url' => expected_url_a,
          'workspaces_url' => expected_url_a + '/workspaces',
          'reference_components_url' => expected_url_a + '/reference_components',
          'rename_url' => expected_url_a + '/name',
          'changelog_viewed' => expected_url_a + '/changelog_viewed',
          'collaboration_invitation_url' => expected_url_a + '/collaboration_invitation',
          'activate_url' => expected_url_a + '/activate',
          'name' => project_a.name.value,
          'type' => project_type,
          'owner' => {
            'id' => user.id,
            'url' => base_url + '/users/' + user.id,
            'name' => user.name.value,
            'changelog_viewed' => false
          },
          'update_date_time' => project_a.update_date_time.value,
          'workspace_count' => project_a.workspaces.count
        }

        json = ProjectJson.projects_as_json(user, base_url)
        expect(json).to include(expected_result_a)
        expect(json).to include(expected_result_b)

        project_a.destroy
        project_b.destroy
        user.destroy
      end
    end

    context 'as_json' do
      it 'returns a json representation of a project' do
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)

        project.add_workspace(user.id, workspace)

        base_url = 'base_url'
        json = ProjectJson.as_json(project.id, base_url, user_id: user.id)
        expect(json).to eq(
          'id' => project.id,
          'creation_date_time' => project.creation_date_time.value,
          'update_date_time' => project.update_date_time.value,
          'owner' => {
            'id' => user.id,
            'url' => base_url + '/users/' + user.id,
            'name' => user.name.value,
            'changelog_viewed' => false
          },
          'name' => project.name.value,
          'type' => project_type,
          'workspaces' => [WorkspaceJson.as_json(workspace.id, base_url, project_id: project.id, user_id: user.id)],
          'inactive_workspaces' => [],
          'is_editable' => true,
          'url' => base_url + '/projects/' + project.id,
          'workspaces_url' => base_url + '/projects/' + project.id + '/workspaces',
          'reference_components_url' => base_url + '/projects/' + project.id + '/reference_components',
          'rename_url' => base_url + '/projects/' + project.id + '/name',
          'changelog_viewed' => base_url + '/projects/' + project.id + '/changelog_viewed',
          'collaboration_invitation_url' => base_url + '/projects/' + project.id + '/collaboration_invitation',
          'activate_url' => base_url + '/projects/' + project.id + '/activate'
        )

        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'returns a json representation of a project with inactive workspaces' do
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        project_type = 'blarg'
        project = Kaiju::ProjectFactory.new_project(user.id, project_type)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        inactive_workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        inactive_workspace.inactivate

        project.add_workspace(user.id, workspace)
        project.add_workspace(user.id, inactive_workspace)

        base_url = 'base_url'
        json = ProjectJson.as_json(project.id, base_url, user_id: user.id)
        expect(json).to eq(
          'id' => project.id,
          'creation_date_time' => project.creation_date_time.value,
          'update_date_time' => project.update_date_time.value,
          'owner' => {
            'id' => user.id,
            'url' => base_url + '/users/' + user.id,
            'name' => user.name.value,
            'changelog_viewed' => false
          },
          'name' => project.name.value,
          'type' => project_type,
          'workspaces' => [WorkspaceJson.as_json(workspace.id, base_url, project_id: project.id, user_id: user.id)],
          'inactive_workspaces' => [
            WorkspaceJson.as_json(inactive_workspace.id, base_url, project_id: project.id, user_id: user.id)
          ],
          'is_editable' => true,
          'url' => base_url + '/projects/' + project.id,
          'workspaces_url' => base_url + '/projects/' + project.id + '/workspaces',
          'reference_components_url' => base_url + '/projects/' + project.id + '/reference_components',
          'rename_url' => base_url + '/projects/' + project.id + '/name',
          'changelog_viewed' => base_url + '/projects/' + project.id + '/changelog_viewed',
          'collaboration_invitation_url' => base_url + '/projects/' + project.id + '/collaboration_invitation',
          'activate_url' => base_url + '/projects/' + project.id + '/activate'
        )

        workspace.destroy
        inactive_workspace.destroy
        project.destroy
        user.destroy
      end
    end
  end
end
