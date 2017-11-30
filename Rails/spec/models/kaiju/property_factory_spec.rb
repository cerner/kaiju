require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe PropertyFactory do
    context 'transform_properties' do
      it 'returns transformed properties' do
        # components = [
        #   [{ 'name' => 'property-schema-example' }, 'spec/lib/mock_data/mock_example.json']
        # ]
        # allow(ComponentInformation).to receive(:sources).and_return(components)
        # ComponentInformation.instance_variable_set(:@components, nil)
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property-schema-example' }, 'spec/lib/mock_data/mock_example.json']
          ]
        )
        properties = ComponentInformation.info('property-schema-example::Example')['properties']
        props = {
          'item' => [
            {
              'items' => %w[a b],
              'display' => 'display'
            }
          ]
        }
        expected = {
          'item' => {
            'id' => 'item',
            'type' => 'Array',
            'value' => [
              {
                'id' => 'item::0',
                'type' => 'Hash',
                'value' => {
                  'items' => {
                    'id' => 'item::0::items',
                    'type' => 'Array',
                    'value' => [
                      {
                        'id' => 'item::0::items::0',
                        'type' => 'String',
                        'value' => 'a'
                      },
                      {
                        'id' => 'item::0::items::1',
                        'type' => 'String',
                        'value' => 'b'
                      }
                    ]
                  },
                  'display' => {
                    'id' => 'item::0::display',
                    'type' => 'String',
                    'value' => 'display'
                  }
                }
              }
            ]
          }
        }
        expect(PropertyFactory.transform_properties(props, properties)).to eq(expected)
      end

      it 'does not crash when no properties are supplied' do
        props = {
          'item' => [
            {
              'items' => %w[a b],
              'display' => 'display'
            }
          ]
        }
        expect(PropertyFactory.transform_properties(props, nil)).to eq({})
      end
    end

    context 'build_transformed_array_value' do
      it 'returns nil if prop is not an array' do
        expect(PropertyFactory.build_transformed_array_value(nil, { 'junk' => 'junk' }, nil)).to be_nil
      end
    end

    context 'build_transformed_hash_value' do
      it 'returns nil if prop is not a hash' do
        expect(PropertyFactory.build_transformed_hash_value(nil, ['junk'], nil)).to be_nil
      end
    end

    context 'rebuild_child_ids' do
      it 'updates the ids of the children' do
        property = {
          'id' => 'item',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'item::0',
              'type' => 'Hash',
              'value' => {
                'items' => {
                  'id' => 'item::0::items',
                  'type' => 'Array',
                  'value' => [
                    {
                      'id' => 'item::0::items::0',
                      'type' => 'String',
                      'value' => 'a'
                    },
                    {
                      'id' => 'item::0::items::1',
                      'type' => 'String',
                      'value' => 'b'
                    }
                  ]
                },
                'display' => {
                  'id' => 'item::0::display',
                  'type' => 'String',
                  'value' => 'display'
                }
              }
            },
            {
              'id' => 'item::0',
              'type' => 'Hash',
              'value' => {
                'items' => {
                  'id' => 'item::0::items',
                  'type' => 'Array',
                  'value' => [
                    {
                      'id' => 'item::0::items::0',
                      'type' => 'String',
                      'value' => 'a'
                    },
                    {
                      'id' => 'item::0::items::1',
                      'type' => 'String',
                      'value' => 'b'
                    }
                  ]
                },
                'display' => {
                  'id' => 'item::0::display',
                  'type' => 'String',
                  'value' => 'display'
                }
              }
            }
          ]
        }

        expected_property = {
          'id' => 'item',
          'type' => 'Array',
          'value' => [
            {
              'id' => 'item::0',
              'type' => 'Hash',
              'value' => {
                'items' => {
                  'id' => 'item::0::items',
                  'type' => 'Array',
                  'value' => [
                    {
                      'id' => 'item::0::items::0',
                      'type' => 'String',
                      'value' => 'a'
                    },
                    {
                      'id' => 'item::0::items::1',
                      'type' => 'String',
                      'value' => 'b'
                    }
                  ]
                },
                'display' => {
                  'id' => 'item::0::display',
                  'type' => 'String',
                  'value' => 'display'
                }
              }
            },
            {
              'id' => 'item::1',
              'type' => 'Hash',
              'value' => {
                'items' => {
                  'id' => 'item::1::items',
                  'type' => 'Array',
                  'value' => [
                    {
                      'id' => 'item::1::items::0',
                      'type' => 'String',
                      'value' => 'a'
                    },
                    {
                      'id' => 'item::1::items::1',
                      'type' => 'String',
                      'value' => 'b'
                    }
                  ]
                },
                'display' => {
                  'id' => 'item::1::display',
                  'type' => 'String',
                  'value' => 'display'
                }
              }
            }
          ]
        }

        PropertyFactory.rebuild_child_ids(property)
        expect(property).to eq(expected_property)
      end
    end
  end
end
