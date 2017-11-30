require 'rails_helper'
require 'component_information'

describe ComponentInformation do
  before(:each) do
    components = [
      [{ 'name' => 'terra-button' }, 'spec/lib/mock_data/mock_button.json'],
      [{ 'name' => 'terra-arrange' }, 'spec/lib/mock_data/mock_arrange.json'],
      [{ 'name' => 'property-schema-example' }, 'spec/lib/mock_data/mock_example.json']
    ]
    allow(ComponentInformation).to receive(:sources).and_return(components)
    ComponentInformation.instance_variable_set(:@cached_components, nil)
    ComponentInformation.components
  end

  context 'info' do
    it 'should return the information for a provided component' do
      expect(ComponentInformation.info('terra-button::Button')).to_not be_nil
    end
  end

  context 'properties' do
    it 'should return the properties for a component' do
      expect(ComponentInformation.properties('terra-button::Button')).to_not be_nil
    end
  end

  context 'components' do
    it 'should return all the components in a hash' do
      expect(ComponentInformation.components.is_a?(Hash)).to eq(true)
    end
  end

  context 'sorted_components' do
    it 'should return all components organized by type' do
      expect(ComponentInformation.sorted_components.is_a?(Array)).to eq(true)
    end

    it 'should place grouped components into the appropriate category' do
      sorted_components = ComponentInformation.sorted_components
      atoms = sorted_components[sorted_components.index { |group| group[:display].eql?('Atoms') }]
      expect(atoms[:children].index { |item| item[:name].eql?('Button') }).to_not be_nil
    end

    it 'should place grouped components into the appropriate nested category' do
      sorted_components = ComponentInformation.sorted_components
      atoms = sorted_components[sorted_components.index { |group| group[:display].eql?('Atoms') }]
      content = atoms[:children][atoms[:children].index { |group| group[:display].eql?('Content') }]
      expect(content[:children].index { |item| item[:name].eql?('Arrange') }).to_not be_nil
    end

    it 'should place ungrouped components into Other' do
      sorted_components = ComponentInformation.sorted_components
      other = sorted_components[sorted_components.index { |group| group[:display].eql?('Other') }]
      expect(other[:children].index { |item| item[:name].eql?('Example') }).to_not be_nil
    end
  end

  context 'property_schema' do
    it 'should find base array property schema' do
      property = {
        'type' => 'Array',
        'form_type' => 'Array',
        'schema' => {
          'type' => 'Hash',
          'form_type' => 'Hash',
          'schema' => {
            'items' => {
              'type' => 'Array',
              'form_type' => 'Array',
              'schema' => {
                'type' => 'String',
                'form_type' => 'String'
              }
            },
            'display' => {
              'type' => 'String',
              'form_type' => 'String'
            }
          }
        }
      }

      expect(ComponentInformation.property_schema('property-schema-example::Example', 'item')).to eq(property)
    end

    it 'should find hash property schema' do
      property = {
        'type' => 'Hash',
        'form_type' => 'Hash',
        'schema' => {
          'items' => {
            'type' => 'Array',
            'form_type' => 'Array',
            'schema' => {
              'type' => 'String',
              'form_type' => 'String'
            }
          },
          'display' => {
            'type' => 'String',
            'form_type' => 'String'
          }
        }
      }

      expect(ComponentInformation.property_schema('property-schema-example::Example', 'item::1')).to eq(property)
    end

    it 'should find nested item property schema' do
      property = {
        'type' => 'String',
        'form_type' => 'String'
      }

      expect(
        ComponentInformation.property_schema(
          'property-schema-example::Example',
          'item::1::display'
        )
      ).to eq(property)
    end
  end

  context 'gather_components' do
    it 'should return a default component' do
      hash = ComponentInformation.gather_components(
        [[{ 'name' => 'property-schema-example' }, 'spec/lib/mock_data/mock_example.json']]
      )
      components = {
        'property-schema-example' => {
          'Example' => {
            'name' => 'Example',
            'description' => 'example to test getting individual schema',
            'type' => 'example',
            'properties' => {
              'item' => {
                'type' => 'Array',
                'form_type' => 'Array',
                'schema' => {
                  'type' => 'Hash',
                  'form_type' => 'Hash',
                  'schema' => {
                    'items' => {
                      'type' => 'Array',
                      'form_type' => 'Array',
                      'schema' => {
                        'type' => 'String',
                        'form_type' => 'String'
                      }
                    },
                    'display' => {
                      'type' => 'String',
                      'form_type' => 'String'
                    }
                  }
                }
              }
            },
            'library' => 'property-schema-example',
            'id' => 'property-schema-example::Example',
            'code_name' => 'Example',
            'import' => 'Example',
            'import_from' => 'property-schema-example',
            'defaults' => { 'item' => ['items' => [nil]] },
            'timestamp' => hash.dig('property-schema-example', 'Example', 'timestamp')
          }
        }
      }
      expect(hash).to eq(components)
    end
  end

  context 'add_component' do
    it 'should add the specified component with an id and defaults' do
      components_hash = Hash.new { |hash, key| hash[key] = {} }
      result = ComponentInformation.add_component(components_hash, { 'name' => 'derp' }, 'name' => 'thing')
      expect(result).to eq(
        'name' => 'thing',
        'library' => 'derp',
        'id' => 'derp::thing',
        'code_name' => 'thing',
        'import' => 'thing',
        'import_from' => 'derp',
        'defaults' => {},
        'timestamp' => result['timestamp']
      )
    end
    it 'should pull the library name from the component' do
      components_hash = Hash.new { |hash, key| hash[key] = {} }
      result = ComponentInformation.add_component(
        components_hash,
        { 'name' => 'derp' },
        'name' => 'thing', 'library' => 'library'
      )
      expect(result).to eq(
        'name' => 'thing',
        'library' => 'library',
        'id' => 'library::thing',
        'code_name' => 'thing',
        'import' => 'thing',
        'import_from' => 'library',
        'defaults' => {},
        'timestamp' => result['timestamp']
      )
    end

    it 'returns defaults' do
      components_hash = Hash.new { |hash, key| hash[key] = {} }
      component = {
        'name' => 'default test',
        'properties' => {
          'stringItem' => {
            'type' => 'String'
          },
          'componentItem' => {
            'type' => 'Component'
          },
          'componentArray' => {
            'type' => 'Array',
            'schema' => {
              'type' => 'Component'
            }
          },
          'componentHash' => {
            'type' => 'Hash',
            'schema' => {
              'comp' => {
                'type' => 'Component'
              },
              'compDefault' => {
                'type' => 'Component'
              }
            }
          },
          'complexComponent' => {
            'type' => 'Hash',
            'schema' => {
              'Array' => {
                'type' => 'Array',
                'schema' => {
                  'type' => 'Hash',
                  'schema' => {
                    'componentHashItem' => {
                      'type' => 'Component'
                    },
                    'stringHashItem' => {
                      'type' => 'String'
                    }
                  }
                }
              }
            }
          }
        }
      }
      expected_defaults = {
        'componentItem' => {
          'type' => 'kaiju::Placeholder'
        }, 'componentArray' => [
          {
            'type' => 'kaiju::Placeholder'
          }
        ], 'componentHash' => {
          'comp' => {
            'type' => 'kaiju::Placeholder'
          }, 'compDefault' => {
            'type' => 'kaiju::Placeholder'
          }
        },
        'complexComponent' => {
          'Array' => [
            {
              'componentHashItem' => {
                'type' => 'kaiju::Placeholder'
              }
            }
          ]
        }
      }
      result = ComponentInformation.add_component(components_hash, { 'name' => 'derp' }, component)
      expect(result['defaults']).to eq(expected_defaults)
    end

    it 'returns blends defaults and placeholders' do
      components_hash = Hash.new { |hash, key| hash[key] = {} }
      component = {
        'name' => 'default test',
        'properties' => {
          'stringItem' => {
            'type' => 'String',
            'default' => 'string'
          },
          'componentItem' => {
            'type' => 'Component',
            'default' => {
              'type' => 'kaiju::Junk',
              'props' => {
                'text' => 'stuff'
              }
            }
          },
          'componentArray' => {
            'type' => 'Array',
            'schema' => {
              'type' => 'Component'
            },
            'default' => [
              {
                'type' => 'kaiju::Junk',
                'props' => {
                  'text' => 'stuff'
                }
              },
              {
                'type' => 'kaiju::Junk',
                'props' => {
                  'text' => 'stuff'
                }
              }
            ]
          },
          'componentHash' => {
            'type' => 'Hash',
            'schema' => {
              'comp' => {
                'type' => 'Component'
              },
              'compDefault' => {
                'type' => 'Component'
              }
            },
            'default' => {
              'compDefault' => {
                'type' => 'kaiju::Junk',
                'props' => {
                  'text' => 'stuff'
                }
              }
            }
          },
          'complexComponent' => {
            'type' => 'Hash',
            'schema' => {
              'Array' => {
                'type' => 'Array',
                'schema' => {
                  'type' => 'Hash',
                  'schema' => {
                    'componentHashItem' => {
                      'type' => 'Component'
                    },
                    'stringHashItem' => {
                      'type' => 'String'
                    }
                  }
                }
              }
            },
            'default' => {
              'Array' => [
                {
                  'stringHashItem' => 'derp'
                },
                {
                  'componentHashItem' => {
                    'type' => 'kaiju::Junk',
                    'props' => {
                      'text' => 'stuff'
                    }
                  }
                }
              ]
            }
          }
        }
      }
      expected_defaults = {
        'stringItem' => 'string',
        'componentItem' => {
          'type' => 'kaiju::Junk',
          'props' => {
            'text' => 'stuff'
          }
        }, 'componentArray' => [
          {
            'type' => 'kaiju::Junk',
            'props' => {
              'text' => 'stuff'
            }
          },
          {
            'type' => 'kaiju::Junk',
            'props' => {
              'text' => 'stuff'
            }
          }
        ],
        'componentHash' => {
          'compDefault' => {
            'type' => 'kaiju::Junk', 'props' => {
              'text' => 'stuff'
            }
          },
          'comp' => {
            'type' => 'kaiju::Placeholder'
          }
        },
        'complexComponent' => {
          'Array' => [
            {
              'stringHashItem' => 'derp',
              'componentHashItem' => {
                'type' => 'kaiju::Placeholder'
              }
            },
            {
              'componentHashItem' => {
                'type' => 'kaiju::Junk',
                'props' => {
                  'text' => 'stuff'
                }
              }
            }
          ]
        }
      }
      result = ComponentInformation.add_component(components_hash, { 'name' => 'derp' }, component)
      expect(result['defaults']).to eq(expected_defaults)
    end
  end

  context 'create_defaults' do
  end
end
