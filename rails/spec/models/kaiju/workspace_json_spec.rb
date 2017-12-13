require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe WorkspaceJson do
    context 'workspace_to_json' do
      it 'should return json for the list of components' do
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        project = Kaiju::ProjectFactory.new_project(user.id)
        workspace_a = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component_a = Kaiju::Component.by_id(workspace_a.component.value)
        workspace_b = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component_b = Kaiju::Component.by_id(workspace_b.component.value)
        project.add_workspace(user.id, workspace_a)
        project.add_workspace(user.id, workspace_b)
        base_url = 'https://herp'

        expected_result = [
          {
            'id' => workspace_a.id,
            'creation_date_time' => workspace_a.creation_date_time.value,
            'update_date_time' => workspace_a.update_date_time.value,
            'author' => {
              'id' => user.id,
              'url' => base_url + '/users/' + user.id,
              'name' => user.name.value,
              'changelog_viewed' => false
            },
            'name' => workspace_a.name.value,
            'component' => {
              'id' => component_a.id,
              'url' => base_url +
                '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/components/' + component_a.id
            },
            'url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id,
            'rename' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/name',
            'undo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/undo',
            'redo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/redo',
            'collaboration_invitation' => base_url +
              '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/collaboration_invitation',
            'activate' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/activate',
            'preview_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/preview',
            'code_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_a.id + '/code',
            'is_editable' => true
          },
          {
            'id' => workspace_b.id,
            'creation_date_time' => workspace_b.creation_date_time.value,
            'update_date_time' => workspace_b.update_date_time.value,
            'author' => {
              'id' => user.id,
              'url' => base_url + '/users/' + user.id,
              'name' => user.name.value,
              'changelog_viewed' => false
            },
            'name' => workspace_b.name.value,
            'component' => {
              'id' => component_b.id,
              'url' => base_url +
                '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/components/' + component_b.id
            },
            'url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id,
            'rename' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/name',
            'undo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/undo',
            'redo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/redo',
            'collaboration_invitation' => base_url +
              '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/collaboration_invitation',
            'activate' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/activate',
            'preview_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/preview',
            'code_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace_b.id + '/code',
            'is_editable' => true
          }
        ]

        json = WorkspaceJson.workspaces_to_json(project, 'https://herp', user_id: user.id)
        expect(json).to eq(JSON.pretty_generate(expected_result))

        workspace_a.destroy
        workspace_b.destroy
        project.destroy
        user.destroy
      end
    end

    context 'to_json' do
      it 'returns standard json' do
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        project = Kaiju::ProjectFactory.new_project(user.id)
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component = Kaiju::Component.by_id(workspace.component.value)

        base_url = 'base_url'
        json = WorkspaceJson.as_json(workspace.id, base_url, user_id: user.id, project_id: project.id)
        expect(json).to eq(
          'id' => workspace.id,
          'creation_date_time' => workspace.creation_date_time.value,
          'update_date_time' => workspace.update_date_time.value,
          'author' => {
            'id' => user.id,
            'url' => base_url + '/users/' + user.id,
            'name' => user.name.value,
            'changelog_viewed' => false
          },
          'name' => workspace.name.value,
          'component' => {
            'id' => component.id,
            'url' => base_url +
              '/projects/' + project.id + '/workspaces/' + workspace.id + '/components/' + component.id
          },
          'url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id,
          'rename' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/name',
          'collaboration_invitation' => base_url +
            '/projects/' + project.id + '/workspaces/' + workspace.id + '/collaboration_invitation',
          'activate' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/activate',
          'undo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/undo',
          'redo_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/redo',
          'code_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/code',
          'preview_url' => base_url + '/projects/' + project.id + '/workspaces/' + workspace.id + '/preview',
          'is_editable' => true
        )

        workspace.destroy
        project.destroy
        user.destroy
      end
    end
  end
end
