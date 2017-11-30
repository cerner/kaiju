require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe PropertyJson do
    context 'as_json' do
      it 'returns json for a hash property' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/test_property_json.json']
          ]
        )
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        base_url = 'base_url'
        project_id = 'project_id'

        id = 'hash'
        property = Property.new(id, component)

        expected_url =  base_url +
                        '/projects/' + project_id +
                        '/workspaces/' + workspace.id + '/components/' + component.id + '/properties/' + property.id

        options = { project_id: project_id, workspace_id: workspace.id, component_id: component.id, user_id: user.id }
        expect(PropertyJson.as_json(id, base_url, options)).to eq(
          'id' => property.id,
          'type' => property.property['type'],
          'form_type' => property.property['type'],
          'schema' => {
            'display' => {
              'type' => 'String',
              'form_type' => 'String'
            }
          },
          'value' => {
            'display' => {
              'id' => 'hash::display',
              'type' => 'String',
              'value' => nil,
              'url' => expected_url + CGI.escape(CGI.escape('::display')),
              'form_type' => 'String',
              'hidden' => false
            }
          },
          'url' => expected_url,
          'hidden' => false
        )
        component.destroy
        workspace.destroy
        user.destroy
      end

      it 'returns json for a array property' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/test_property_json.json']
          ]
        )
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        base_url = 'base_url'
        project_id = 'project_id'

        id = 'StringArray'
        property = Property.new(id, component)

        expected_url =  base_url +
                        '/projects/' + project_id +
                        '/workspaces/' + workspace.id + '/components/' + component.id + '/properties/' + property.id

        options = { project_id: project_id, workspace_id: workspace.id, component_id: component.id, user_id: user.id }
        expect(PropertyJson.as_json(id, base_url, options)).to eq(
          'id' => property.id,
          'type' => property.property['type'],
          'form_type' => property.property['type'],
          'schema' => {
            'type' => 'String',
            'form_type' => 'String'
          },
          'value' => [{
            'id' => property.id + '::0',
            'type' => 'String',
            'value' => nil,
            'url' => expected_url + CGI.escape(CGI.escape('::0')),
            'insert_before_url' => expected_url + CGI.escape(CGI.escape('::0')) + '?insert_before=true',
            'insert_after_url' => expected_url + CGI.escape(CGI.escape('::0')) + '?insert_after=true',
            'form_type' => 'String',
            'hidden' => false
          }],
          'url' => expected_url,
          'append_url' => expected_url + '?append=true',
          'hidden' => false
        )
        component.destroy
        workspace.destroy
        user.destroy
      end

      it 'returns json for a standard property' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/test_property_json.json']
          ]
        )
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        base_url = 'base_url'
        project_id = 'project_id'

        id = 'display'
        property = Property.new(id, component)

        options = { project_id: project_id, workspace_id: workspace.id, component_id: component.id, user_id: user.id }
        expect(PropertyJson.as_json(id, base_url, options)).to eq(
          'id' => property.id,
          'type' => property.property['type'],
          'value' => nil,
          'url' => base_url +
            '/projects/' + project_id +
            '/workspaces/' + workspace.id + '/components/' + component.id + '/properties/' + property.id,
          'description' => 'a display',
          'display' => 'display',
          'hidden' => true,
          'options' => %w[option_A option_B],
          'form_type' => 'URLForm'
        )
        component.destroy
        workspace.destroy
        user.destroy
      end

      it 'returns json for a component property' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/test_property_json.json']
          ]
        )
        user = Kaiju::UserFactory.new_user('owner', 'derpface')
        workspace = Kaiju::WorkspaceFactory.new_workspace(user.id)
        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        base_url = 'base_url'
        project_id = 'project_id'

        id = 'component'
        property = Property.new(id, component)

        expected_url =  base_url +
                        '/projects/' + project_id +
                        '/workspaces/' + workspace.id + '/components/' + component.id + '/properties/' + property.id

        options = { project_id: project_id, workspace_id: workspace.id, component_id: component.id, user_id: user.id }
        expect(PropertyJson.as_json(id, base_url, options)).to eq(
          'id' => property.id,
          'type' => property.property['type'],
          'form_type' => property.property['type'],
          'value' => ComponentJson.as_json(
            property.property['value']['id'], base_url, options
          ),
          'url' => expected_url,
          'hidden' => false
        )
        component.destroy
        workspace.destroy
        user.destroy
      end
    end
  end
end
