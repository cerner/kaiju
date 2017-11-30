require 'rails_helper'
require 'properties_helper'
module Kaiju # rubocop:disable Metrics/ModuleLength
  describe ComponentFactory do
    context 'rebuild_properties' do
      it 'should recreate the same Component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component1.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Button', nil)
        old_component = component.as_json
        ComponentFactory.rebuild_properties(component)
        new_component = component.as_json
        expect(old_component.dig('properties', 'icon', 'value', 'id')).to eq(
          new_component.dig('properties', 'icon', 'value', 'id')
        )
        old_component['properties']['icon']['value']['id'] = new_component.dig('properties', 'icon', 'value', 'id')
        old_component['update_date_time'] = new_component.dig('update_date_time')
        expect(new_component).to eq(old_component)

        component.destroy
      end

      it 'should recreate the same Component with a different timestamp' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component1.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Button', nil)
        old_component = component.as_json

        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component1.json']
          ]
        )

        ComponentFactory.rebuild_properties(component)
        new_component = component.as_json
        expect(old_component.dig('properties', 'icon', 'value', 'id')).to eq(
          new_component.dig('properties', 'icon', 'value', 'id')
        )
        expect(old_component.dig('properties_timestamp')).not_to eq(
          new_component.dig('properties_timestamp')
        )
        old_component['properties']['icon']['value']['id'] = new_component.dig('properties', 'icon', 'value', 'id')
        old_component['update_date_time'] = new_component.dig('update_date_time')
        old_component['properties_timestamp'] = new_component.dig('properties_timestamp')
        expect(new_component).to eq(old_component)

        component.destroy
      end

      it 'should recreate the same Component with new schema' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component1.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Button', nil)
        old_component = component.as_json

        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component2.json']
          ]
        )

        ComponentFactory.rebuild_properties(component)
        new_component = component.as_json
        expect(old_component.dig('properties', 'icon', 'value', 'id')).to eq(
          new_component.dig('properties', 'icon', 'value', 'id')
        )
        expect(old_component.dig('properties_timestamp')).not_to eq(
          new_component.dig('properties_timestamp')
        )
        old_component['properties']['icon']['value']['id'] = new_component.dig('properties', 'icon', 'value', 'id')
        old_component['update_date_time'] = new_component.dig('update_date_time')
        old_component['properties_timestamp'] = new_component.dig('properties_timestamp')
        old_component['properties']['derp'] = { 'id' => 'derp', 'type' => 'String', 'value' => nil }
        expect(new_component).to eq(old_component)

        component.destroy
      end

      it 'should recreate the same Component with removed property' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component1.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Button', nil)
        old_component = component.as_json

        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_rebuild_component3.json']
          ]
        )

        ComponentFactory.rebuild_properties(component)
        new_component = component.as_json
        expect(old_component.dig('properties', 'icon', 'value', 'id')).not_to eq(
          new_component.dig('properties', 'icon', 'value', 'id')
        )
        expect(old_component.dig('properties_timestamp')).not_to eq(
          new_component.dig('properties_timestamp')
        )
        # old_component['properties']['icon']['value']['id'] = new_component.dig('properties', 'icon', 'value', 'id')
        old_component['update_date_time'] = new_component.dig('update_date_time')
        old_component['properties_timestamp'] = new_component.dig('properties_timestamp')
        old_component['properties'].delete('icon')
        expect(new_component).to eq(old_component)

        component.destroy
      end
    end

    context 'new_component' do
      it 'creates a new component with the provided id' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        props = {
          'display' => 'text',
          'component' => {
            'type' => 'property::Example',
            'id' => 'derp2',
            'props' => {
              'display' => 'item'
            }
          }
        }

        component = Kaiju::ComponentFactory.new_component('property::Example', props, 'derp', 'herp')

        expect(component.id).to eq('derp')
        expect(component.parent.value).to eq('herp')
        expect(component.creation_date_time.value).to_not be_nil
        expect(component.type.value).to eq('property::Example')
        expect(component.update_date_time.value).to_not be_nil
        expect(component.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => 'text'
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => 'derp2'
            }
          }
        )
        expect(component.properties_timestamp.value).to_not be_nil

        component2 = Component.by_id('derp2')
        expect(component2.id).to eq('derp2')
        expect(component2.parent.value).to eq(component.id)
        expect(component2.type.value).to eq('property::Example')
        expect(component2.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => 'item'
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => component2.properties.value['component']['value']['id']
            }
          }
        )

        component.destroy
      end

      it 'creates a new component without provided id' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        props = {
          'display' => 'text',
          'component' => {
            'type' => 'property::Example',
            'props' => {
              'display' => 'item'
            }
          }
        }

        component = Kaiju::ComponentFactory.new_component('property::Example', props)

        expect(component.id).to_not eq(nil)
        expect(component.parent.value).to eq(nil)
        expect(component.creation_date_time.value).to_not be_nil
        expect(component.type.value).to eq('property::Example')
        expect(component.update_date_time.value).to_not be_nil
        expect(component.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => 'text'
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => component.properties.value['component']['value']['id']
            }
          }
        )
        expect(component.properties_timestamp.value).to_not be_nil

        component2 = Component.by_id(component.properties.value['component']['value']['id'])
        expect(component2.id).to_not eq(nil)
        expect(component2.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => 'item'
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => component2.properties.value['component']['value']['id']
            }
          }
        )

        component.destroy
      end

      it 'creates a new component with bad props' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        props = {
          'display' => 'text',
          'component' => 'text'
        }

        component = Kaiju::ComponentFactory.new_component('property::Example', props)

        expect(component.id).to_not eq(nil)
        expect(component.parent.value).to eq(nil)
        expect(component.creation_date_time.value).to_not be_nil
        expect(component.type.value).to eq('property::Example')
        expect(component.update_date_time.value).to_not be_nil
        expect(component.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => 'text'
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => component.properties.value['component']['value']['id']
            }
          }
        )
        expect(component.properties_timestamp.value).to_not be_nil

        component2 = Component.by_id(component.properties.value['component']['value']['id'])
        expect(component2.id).to_not eq(nil)
        expect(component2.type.value).to eq('kaiju::Placeholder')

        component.destroy
      end

      it 'creates a new component with nil props' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        props = nil

        component = Kaiju::ComponentFactory.new_component('property::Example', props)

        expect(component.id).to_not eq(nil)
        expect(component.parent.value).to eq(nil)
        expect(component.creation_date_time.value).to_not be_nil
        expect(component.type.value).to eq('property::Example')
        expect(component.update_date_time.value).to_not be_nil
        expect(component.properties.value).to eq(
          'display' => {
            'id' => 'display',
            'type' => 'String',
            'value' => nil
          },
          'component' => {
            'id' => 'component',
            'type' => 'Component',
            'value' => {
              'id' => component.properties.value['component']['value']['id']
            }
          }
        )
        expect(component.properties_timestamp.value).to_not be_nil

        component2 = Component.by_id(component.properties.value['component']['value']['id'])
        expect(component2.id).to_not eq(nil)
        expect(component2.type.value).to eq('kaiju::Placeholder')

        component.destroy
      end

      it 'creates a placeholder when it can not find the element' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        props = nil

        component = Kaiju::ComponentFactory.new_component('derp::Derp', props)

        expect(component.id).to_not eq(nil)
        expect(component.type.value).to eq('kaiju::Placeholder')

        component.destroy
      end
    end
  end
end
