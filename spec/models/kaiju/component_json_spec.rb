require 'rails_helper'

module Kaiju
  describe ComponentJson do
    context 'as_json' do
      it 'returns json for a component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_json.json']
          ]
        )
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id, 'blarg')
        component = Kaiju::ComponentFactory.new_component('blarg', 'property::Example', nil)
        base_url = 'base_url'
        project_id = 'project_id'
        # id = 'display'
        # property = Property.new(id, component)

        expect(
          Kaiju::ComponentJson.as_json(
            component.id, base_url, project_id: project_id, workspace_id: workspace.id, user_id: user.id
          )
        ).to eq(
          'id' => component.id,
          'creation_date_time' => component.creation_date_time.value,
          'update_date_time' => component.update_date_time.value,
          'parent' => component.parent.value,
          'type' => component.type.value,
          'project_type' => component.project_type.value,
          'inactive' => component.inactive.value,
          'properties' => {
            'display' => {
              'id' => 'display',
              'type' => 'String',
              'form_type' => 'String',
              'value' => nil,
              'url' => base_url +
                '/projects/' + project_id +
                '/workspaces/' + workspace.id + '/components/' + component.id + '/properties/display',
              'hidden' => false
            }
          },
          'display' => nil,
          'name' => 'Example',
          'code_name' => 'Example',
          'url' => base_url + '/projects/' + project_id + '/workspaces/' + workspace.id + '/components/' + component.id,
          'is_editable' => true
        )

        component.destroy
        workspace.destroy
        user.destroy
      end
    end
  end
end
