require 'rails_helper'
require 'lib/component_information_spec_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe Property do
    context 'find_property' do
      it 'finds a base property' do
        properties = {
          'array_item' => {
            'value' => [
              {
                'value' => {
                  'display' => {
                    'value' => 'display'
                  }
                }
              }
            ]
          }
        }
        expected_parent_property = nil
        expected_property = properties['array_item']
        id = 'array_item'
        property, last_key, parent_property = Property.find_property(id, properties)
        expect(property).to eq(expected_property)
        expect(parent_property).to eq(expected_parent_property)
        expect(last_key).to eq(id)
      end

      it 'finds an array property' do
        properties = {
          'array_item' => {
            'value' => [
              {
                'value' => {
                  'display' => {
                    'value' => 'display'
                  }
                }
              }
            ]
          }
        }
        expected_parent_property = properties['array_item']
        expected_property = properties['array_item']['value'][0]
        id = 'array_item::0'
        property, last_key, parent_property = Property.find_property(id, properties)
        expect(property).to eq(expected_property)
        expect(parent_property).to eq(expected_parent_property)
        expect(last_key).to eq(0)
      end
      it 'finds a nested item property' do
        properties = {
          'array_item' => {
            'value' => [
              {
                'value' => {
                  'display' => {
                    'value' => 'display'
                  }
                }
              }
            ]
          }
        }
        expected_parent_property = properties['array_item']['value'][0]
        expected_property = properties['array_item']['value'][0]['value']['display']
        id = 'array_item::0::display'
        property, last_key, parent_property = Property.find_property(id, properties)
        expect(property).to eq(expected_property)
        expect(parent_property).to eq(expected_parent_property)
        expect(last_key).to eq('display')
      end
    end
    context 'initialize' do
      it 'sets defaults' do
        id = 'item'
        component = double('component')
        properties = double('properties')
        value = {
          'item' => {
            'type' => 'string'
          }
        }
        allow(component).to receive(:properties).and_return(properties)
        allow(properties).to receive(:value).and_return(value)

        property = Property.new(id, component)
        expect(property.id).to eq(id)
        expect(property.component).to eq(component)
        expect(property.parent_property).to eq(nil)
        expect(property.property).to eq('type' => 'string')
        expect(property.last_key).to eq('item')
      end
    end

    context 'by_id' do
      it 'finds the property' do
        id = 'item'
        component = double('component')
        properties = double('properties')
        value = {
          'item' => {
            'type' => 'string'
          }
        }
        allow(component).to receive(:properties).and_return(properties)
        allow(properties).to receive(:value).and_return(value)

        property = Property.by_id(id, component)
        expect(property).to_not be_nil
      end

      it 'does not find the property' do
        id = 'derp'
        component = double('component')
        properties = double('properties')
        value = {
          'item' => {
            'type' => 'string'
          }
        }
        allow(component).to receive(:properties).and_return(properties)
        allow(properties).to receive(:value).and_return(value)

        property = Property.by_id(id, component)
        expect(property).to be_nil
      end

      it 'does not find a missing array property' do
        properties = {
          'array_item' => {
            'value' => [
              {
                'value' => {
                  'display' => {
                    'value' => 'display'
                  }
                }
              }
            ]
          }
        }
        expected_parent_property = properties['array_item']
        # expected_property = properties['array_item']['value'][0]
        id = 'array_item::1'
        property, last_key, parent_property = Property.find_property(id, properties)
        expect(property).to be_nil
        expect(parent_property).to eq(expected_parent_property)
        expect(last_key).to eq(1)
      end
    end

    context 'schema' do
      it 'returns new schema' do
        id = 'item'
        component = double('component')
        properties = double('properties')
        type = double('type')
        value = {
          'item' => {
            'type' => 'string'
          }
        }
        type_value = 'testThing'
        schema = 'thing'
        allow(component).to receive(:properties).and_return(properties)
        allow(properties).to receive(:value).and_return(value)
        allow(component).to receive(:type).and_return(type)
        allow(type).to receive(:value).and_return(type_value)

        allow(ComponentInformation).to receive(:property_schema).with('testThing', id).and_return(schema, 'junk')

        property = Property.new(id, component)
        expect(property.schema(id)).to eq(schema)
        expect(property.schema(id)).to eq(schema)
      end
    end

    context 'update' do
      it 'updates an existing item' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        new_id = property.update(prop)

        expect(property.property).to eq(
          'id' => 'display',
          'type' => 'String',
          'value' => 'new_string'
        )
        expect(new_id).to eq(id)

        component.destroy
      end

      it 'updates an existing placeholder' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'component'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        old_id = component.properties.value['component']['value']['id']

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'component',
          'type' => 'Component',
          'value' => {
            'id' => old_id
          }
        )
        new_comp = Kaiju::Component.by_id(property.property['value']['id'])

        expect(new_comp.type.value).to eq('property::Example')

        component.destroy
      end

      it 'adds a new component where one did not exist' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'noDropZoneComponent'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'noDropZoneComponent',
          'type' => 'Component',
          'value' => {
            'id' => property.property['value']['id']
          }
        )
        new_comp = Kaiju::Component.by_id(property.property['value']['id'])

        expect(new_comp.type.value).to eq('property::Example')

        old_id = property.property['value']['id']

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'noDropZoneComponent',
          'type' => 'Component',
          'value' => {
            'id' => old_id
          }
        )

        component.destroy
      end

      it 'updates automatically includes unstated placeholder' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'hash'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'display' => 'bob'
        }

        property.update(prop)

        component_id = property.property['value']['component']['value']['id']

        expect(component_id).to_not be_nil

        array_component_id = property.property['value']['array']['value'][0]['value']['id']

        expect(array_component_id).to_not be_nil

        expect(property.property).to eq(
          'id' => 'hash',
          'type' => 'Hash',
          'value' => {
            'component' => {
              'id' => 'hash::component',
              'type' => 'Component',
              'value' => {
                'id' => component_id
              }
            },
            'display' => {
              'id' => 'hash::display',
              'type' => 'String',
              'value' => 'bob'
            },
            'array' => {
              'id' => 'hash::array',
              'type' => 'Array',
              'value' => [
                {
                  'id' => 'hash::array::0',
                  'type' => 'Component',
                  'value' => {
                    'id' => array_component_id
                  }
                }
              ]
            }
          }
        )

        component.destroy
      end

      it 'inserts a placeholder if you attempt to to insert a blank component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'noDropZoneComponent'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = nil

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'noDropZoneComponent',
          'type' => 'Component',
          'value' => nil
        )

        component.destroy
      end

      it 'inserts a nil if you attempt to to insert a nil compoent with no drop zone' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'component'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        old_id = component.properties.value['component']['value']['id']

        property = Property.new(id, component)
        prop = nil

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'component',
          'type' => 'Component',
          'value' => {
            'id' => old_id
          }
        )
        new_comp = Kaiju::Component.by_id(property.property['value']['id'])

        expect(new_comp.type.value).to eq('kaiju::Placeholder')

        component.destroy
      end
    end

    context 'insert' do
      it 'inserts a string before' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        new_id = property.insert(prop)

        parent_property = Property.new('StringArray', Kaiju::Component.by_id(component.id))

        expect(parent_property.property).to eq(
          'id' => 'StringArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'StringArray::0',
              'type' => 'String',
              'value' => 'new_string'
            },
            {
              'id' => 'StringArray::1',
              'type' => 'String',
              'value' => 'item1'
            },
            {
              'id' => 'StringArray::2',
              'type' => 'String',
              'value' => 'item2'
            }
          ]
        )
        expect(new_id).to eq(id)

        component.destroy
      end

      it 'inserts a string after' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        new_id = property.insert(prop, 'after' => true)

        parent_property = Property.new('StringArray', Kaiju::Component.by_id(component.id))

        expect(parent_property.property).to eq(
          'id' => 'StringArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'StringArray::0',
              'type' => 'String',
              'value' => 'item1'
            },
            {
              'id' => 'StringArray::1',
              'type' => 'String',
              'value' => 'new_string'
            },
            {
              'id' => 'StringArray::2',
              'type' => 'String',
              'value' => 'item2'
            }
          ]
        )
        expect(new_id).to eq('StringArray::1')

        component.destroy
      end

      it 'inserts a component after without deleting the previous' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'ComponentArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        new_id = property.insert(prop, 'after' => true)

        parent_property = Property.new('ComponentArray', Kaiju::Component.by_id(component.id))

        expect(parent_property.property).to eq(
          'id' => 'ComponentArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'ComponentArray::0',
              'type' => 'Component',
              'value' => {
                'id' => parent_property.property['value'][0]['value']&.dig('id')
              }
            },
            {
              'id' => 'ComponentArray::1',
              'type' => 'Component',
              'value' => parent_property.property['value'][1]['value']
            }
          ]
        )
        expect(new_id).to eq('ComponentArray::1')

        component.destroy
      end

      it 'returns nil on non arrays' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        expect(property.insert(prop)).to be nil

        component.destroy
      end
    end

    context 'append' do
      it 'adds an item to the end of an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        new_id = property.append(prop)

        expect(property.property).to eq(
          'id' => 'StringArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'StringArray::0',
              'type' => 'String',
              'value' => 'item1'
            },
            {
              'id' => 'StringArray::1',
              'type' => 'String',
              'value' => 'item2'
            },
            {
              'id' => 'StringArray::2',
              'type' => 'String',
              'value' => 'new_string'
            }
          ]
        )
        expect(new_id).to eq('StringArray::2')

        component.destroy
      end

      it 'does not destroy other components' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'ComponentArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        new_id = property.append(prop)

        expect(property.property).to eq(
          'id' => 'ComponentArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'ComponentArray::0',
              'type' => 'Component',
              'value' => {
                'id' => property.property['value'][0]['value']&.dig('id')
              }
            },
            {
              'id' => 'ComponentArray::1',
              'type' => 'Component',
              'value' => property.property['value'][1]['value']
            }
          ]
        )
        expect(new_id).to eq('ComponentArray::1')

        component.destroy
      end

      it 'returns nil on non arrays' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        expect(property.append(prop)).to be nil

        component.destroy
      end

      it 'creates adds to an array without defaults' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArrayNoDefault'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        property.append(prop)

        expect(property.property).to eq(
          'id' => 'StringArrayNoDefault',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'StringArrayNoDefault::0',
              'type' => 'String',
              'value' => nil
            },
            {
              'id' => 'StringArrayNoDefault::1',
              'type' => 'String',
              'value' => 'new_string'
            }
          ]
        )

        component.destroy
      end
    end

    context 'destroy' do
      it 'destroys a basic component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'new_string'

        property.update(prop)
        property.destroy

        expect(property.property).to eq(
          'id' => 'display',
          'type' => 'String',
          'value' => nil
        )

        component.destroy
      end

      it 'destroys an item from an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        property.destroy

        expect(Property.by_id(id, component)).to be_nil

        component.destroy
      end

      it 'destroys an item from an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        property.destroy

        property = Property.new(id, component)
        expect(property.property).to eq(
          'id' => 'StringArray::0',
          'type' => 'String',
          'value' => 'item2'
        )

        component.destroy
      end

      it 'destroys non placeholder values in a hash' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'hash'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'display' => 'bob'
        }

        property.update(prop)
        property.destroy
        expect(property.property['value']['display']).to eq(
          'id' => 'hash::display',
          'type' => 'String',
          'value' => nil
        )

        expect(property.property['value']['component']).to_not be_nil

        component.destroy
      end

      it 'destroys a component and is reset to a placeholder' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'component'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        old_id = component.properties.value['component']['value']['id']

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        property.update(prop)
        property.destroy

        expect(property.property).to eq(
          'id' => 'component',
          'type' => 'Component',
          'value' => {
            'id' => old_id
          }
        )
        new_comp = Kaiju::Component.by_id(property.property['value']['id'])

        expect(new_comp.type.value).to eq('kaiju::Placeholder')

        component.destroy
      end

      it 'destroys a no drop zone component completely' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'noDropZoneComponent'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = {
          'type' => 'property::Example'
        }

        property.update(prop)
        property.destroy

        expect(property.property).to eq(
          'id' => 'noDropZoneComponent',
          'type' => 'Component',
          'value' => nil
        )

        component.destroy
      end

      it 'does not remove the last element in an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArrayNoDefault::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)
        prop = 'derp'

        property.update(prop)

        expect(property.property).to eq(
          'id' => 'StringArrayNoDefault::0',
          'type' => 'String',
          'value' => 'derp'
        )

        property.destroy

        expect(property.property).to eq(
          'id' => 'StringArrayNoDefault::0',
          'type' => 'String',
          'value' => nil
        )

        component.destroy
      end

      it 'does not remove the last element in an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_update_property.json']
          ]
        )
        id = 'StringArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        property.destroy

        expect(property.property).to eq(
          'id' => 'StringArray',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'StringArray::0',
              'type' => 'String',
              'value' => nil
            }
          ]
        )

        component.destroy
      end
    end

    context 'generate_prop' do
      it 'returns the child_output' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(Property.generate_prop(property.property, 'derp')).to eq('derp')

        component.destroy
      end

      it 'returns the value with nil child_output' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(Property.generate_prop(property.property, nil)).to eq('Display')

        component.destroy
      end

      it 'returns the properties of the component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'component'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(Property.generate_prop(property.property, nil)).to eq(
          'id' => property.property['value']['id'],
          'type' => 'kaiju::Placeholder',
          'props' => {}
        )

        component.destroy
      end
    end

    context 'generate_props' do
      it 'recursively generates props' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(Property.generate_props(property.property)).to eq(%w[item1 item2])

        component.destroy
      end
    end

    context 'generate_inverse_destroy_change_for_arrays' do
      it 'returns a insert before action' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_inverse_destroy_change_for_arrays(property.parent_property['value'])).to eq(
          property_id: 'StringArray::0',
          action: 'insert_before',
          props: 'item1'
        )

        component.destroy
      end

      it 'returns an insert after action' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_inverse_destroy_change_for_arrays(property.parent_property['value'])).to eq(
          property_id: 'StringArray::0',
          action: 'insert_after',
          props: 'item2'
        )

        component.destroy
      end
    end

    context 'generate_inverse_destroy_change' do
      it 'returns an insert action if removing from an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_inverse_destroy_change).to eq(
          property_id: 'StringArray::0',
          action: 'insert_after',
          props: 'item2'
        )

        component.destroy
      end

      it 'returns an update action for the last item in an array' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArrayOneItem::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_inverse_destroy_change).to eq(
          property_id: 'StringArrayOneItem::0',
          action: 'update',
          props: 'item0'
        )

        component.destroy
      end

      it 'returns an update action for a simple item' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_inverse_destroy_change).to eq(
          property_id: 'display',
          action: 'update',
          props: 'Display'
        )

        component.destroy
      end
    end

    context 'generate_undo_change' do
      it 'generates an update change for a destroy' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_undo_change('destroy')).to eq(
          property_id: 'display',
          action: 'update',
          props: 'Display'
        )

        component.destroy
      end

      it 'generates an update change for an update' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_undo_change('update')).to eq(
          property_id: 'display',
          action: 'update',
          props: 'Display'
        )

        component.destroy
      end

      it 'generates a destroy action on an insert_after' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_undo_change('insert_after')).to eq(
          property_id: 'StringArray::2',
          action: 'destroy'
        )

        component.destroy
      end

      it 'generates a destroy action on an insert_before' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_undo_change('insert_before')).to eq(
          property_id: 'StringArray::1',
          action: 'destroy'
        )

        component.destroy
      end

      it 'generates a destroy action on an append' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_undo_change('append')).to eq(
          property_id: 'StringArray::2',
          action: 'destroy'
        )

        component.destroy
      end
    end

    context 'generate_change' do
      it 'generates an update change for a destroy' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_change('destroy')).to eq(
          property_id: id,
          action: 'destroy'
        )

        component.destroy
      end

      it 'generates an update change for an update' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_change('update')).to eq(
          property_id: id,
          action: 'update',
          props: 'Display'
        )

        component.destroy
      end

      it 'generates an update change for an insert_before' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::1'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_change('insert_before')).to eq(
          property_id: id,
          action: 'insert_before',
          props: 'item2'
        )

        component.destroy
      end

      it 'generates an update change for an insert_after' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray::0'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_change('insert_after')).to eq(
          property_id: id,
          action: 'insert_after',
          props: 'item2'
        )

        component.destroy
      end

      it 'generates an update change for an append' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'StringArray'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        expect(property.generate_change('append')).to eq(
          property_id: id,
          action: 'append',
          props: 'item2'
        )

        component.destroy
      end
    end

    context 'properties_ast' do
      it 'removes nil property keys' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        expect(Property.properties_ast(component.properties.value)).to eq(
          {}
        )

        component.destroy
      end

      it 'removes nil property keys' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        Property.new('Display', component).update('derp')
        expect(Property.properties_ast(component.properties.value)).to eq(
          'Display' => {
            'id' => 'Display',
            'type' => 'String',
            'value' => 'derp'
          }
        )

        component.destroy
      end
    end

    context 'property_ast' do
      it 'returns nil if the property has a nil value' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('Display', component)
        expect(Property.property_ast(property.property, nil)).to be_nil

        component.destroy
      end

      it 'returns the property if it has a value' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('Display', component)
        property.update('derp')
        expect(Property.property_ast(property.property, nil)).to eq(
          'id' => 'Display',
          'type' => 'String',
          'value' => 'derp'
        )

        component.destroy
      end

      it 'returns nil if the component is a placeholder' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('Component', component)
        expect(Property.property_ast(property.property, nil)).to be_nil

        component.destroy
      end

      it 'returns nil if the component is nil' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('NoDropZoneComponent', component)
        expect(Property.property_ast(property.property, nil)).to be_nil

        component.destroy
      end

      it 'returns the component property if the component is not nil' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('Component', component)
        property.update(
          'type' => 'property::Example'
        )
        expect(Property.property_ast(property.property, nil)).to eq(
          'id' => 'Component',
          'type' =>  'Component',
          'value' => {
            'id' => property.property['value']['id'],
            'type' => 'property::Example',
            'name' => 'Example',
            'code_name' => 'Example',
            'import' => 'Example',
            'import_from' => 'property',
            'properties' => {}
          }
        )

        component.destroy
      end

      it 'returns nil if the array contains empty items' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('StringArray', component)
        expect(Property.property_ast(property.property, [nil])).to be_nil

        component.destroy
      end

      it 'returns nil if the array is empty' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('StringArray', component)
        expect(Property.property_ast(property.property, [])).to be_nil

        component.destroy
      end

      it 'returns the component if child_output is valued' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('StringArray', component)
        child_property = { 'id' => 'StringArray::0', 'type' => 'String', 'value' => 'item' }
        expect(Property.property_ast(property.property, [child_property])).to eq(
          'id' => 'StringArray',
          'type' => 'Array',
          'value' => [child_property]
        )

        component.destroy
      end

      it 'returns nil if the child output hash has no keys' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('StingHash', component)
        child_property = {}
        expect(Property.property_ast(property.property, child_property)).to be_nil

        component.destroy
      end

      it 'removes nil values from arrays' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_component_sanatization.json']
          ]
        )

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)
        property = Property.new('ComponentArray', component)
        expect(Property.property_ast(property.property, [nil, 'string'])).to eq(
          'id' => 'ComponentArray',
          'type' => 'Array',
          'value' => ['string']
        )

        component.destroy
      end
    end
  end
end
