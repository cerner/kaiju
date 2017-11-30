require 'rails_helper'
require 'properties_helper'
module Kaiju # rubocop:disable Metrics/ModuleLength
  describe Component do
    context 'initialization' do
      it 'should initialize a Component object with a predefined id' do
        id = 'unique'
        @workspace = Component.new(id)
        expect(@workspace.id).to eq(id)
      end
    end

    context 'ast' do
      it 'returns an ast object without placeholders' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        expect(component.ast).to eq(
          'id' => component.id,
          'type' => component.type.value,
          'name' => 'Example',
          'import' => 'Example',
          'import_from' => 'property',
          'code_name' => 'Example',
          'properties' => {}
        )

        component.destroy
      end
    end

    context 'child_components' do
      it 'collects child components' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        id = 'component'
        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }
        property.update(prop)

        expect(component.child_components.count).to eq(2)
        expect(component.child_components[1].id).to eq(property.property['value']['id'])
        second_id = Property.new(id, Kaiju::Component.by_id(property.property['value']['id'])).property['value']['id']
        expect(component.child_components[0].id).to eq(second_id)

        component.destroy
      end

      it 'executes a block for each item' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        id = 'component'
        property = Property.new(id, component)

        expect(component.child_components.count).to eq(1)
        expect(component.child_components(&:id)).to include(property.property['value']['id'])

        component.destroy
      end

      it 'does not return nil values' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        expect(component.child_components.count).to eq(1)
        expect(component.child_components { |_obj| nil }).to eq([])

        component.destroy
      end

      it 'does not act on junk child components' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        properties = component.properties.value

        Component.by_id(properties['component']['value']['id']).destroy

        properties['component']['value'] = ['derp']

        component.properties = properties

        expect(component.child_components.count).to eq(0)
        expect(component.child_components).to eq([])

        component.destroy
      end
    end

    context 'inactivate' do
      it 'it inactivates itself and children' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        id = 'component'
        property = Property.new(id, component)

        component.inactivate
        expect(component.inactive.value).to be true
        expect(component.ttl).to be_within(5).of(30.days)
        child_component = Kaiju::Component.by_id(property.property['value']['id'])
        expect(child_component.inactive.value).to be true
        expect(child_component.ttl).to be_within(5).of(30.days)

        component.destroy
      end
    end

    context 'activate' do
      it 'it activates itself and children' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        id = 'component'
        property = Property.new(id, component)

        component.inactivate
        component.activate
        expect(component.inactive.value).to be false
        expect(component.ttl).to eq(-1)
        child_component = Kaiju::Component.by_id(property.property['value']['id'])
        expect(child_component.inactive.value).to be false
        expect(child_component.ttl).to eq(-1)

        component.destroy
      end
    end

    context 'current_schema?' do
      it 'has current schema' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        expect(component.current_schema?).to be true

        component.destroy
      end

      it 'doe not have current schema' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_child_components.json']
          ]
        )
        expect(component.current_schema?).to be false

        component.destroy
      end
    end

    context 'generate_props' do
      it 'generates the props that would represent the component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('text::Mock_text', 'text' => 'derp')

        expect(component.generate_props).to eq(
          'id' => component.id,
          'type' => component.type.value,
          'props' => {
            'text' => 'derp'
          }
        )

        component.destroy
      end
    end

    context 'generate_change' do
      it 'generates the change object based on the current component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('text::Mock_text', 'text' => 'derp')

        expect(component.generate_change('action')).to eq(
          action: 'action',
          props: {
            'id' => component.id,
            'type' => component.type.value,
            'props' => {
              'text' => 'derp'
            }
          }
        )

        component.destroy
      end
    end

    context 'generate_props_for_properties' do
      it 'generates the props for the properties with a block' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('text::Mock_text', 'text' => 'derp')
        result = component.generate_props_for_properties do |key, _property, _parent, _child_output|
          expect(key).to eq('text')
        end

        expect(result).to eq(
          'text' => 'derp'
        )

        component.destroy
      end

      it 'generates the props for the properties without a block' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('text::Mock_text', 'text' => 'derp')
        result = component.generate_props_for_properties

        expect(result).to eq(
          'text' => 'derp'
        )

        component.destroy
      end
    end
  end
end
