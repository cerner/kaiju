require 'rails_helper'
require 'iterate_reference_property'

describe IterateReferenceProperty do
  before(:each) do
    @reference_properties = {
      'display' => {
        'type' => 'String'
      },
      'component' => {
        'type' => 'Component'
      },
      'noDropZoneComponent' => {
        'type' => 'Component',
        'drop_zone' => false
      },
      'hash' => {
        'type' => 'Hash',
        'schema' => {
          'component' => {
            'type' => 'Component'
          },
          'display' => {
            'type' => 'String'
          },
          'array' => {
            'type' => 'Array',
            'schema' => {
              'type' => 'Component'
            }
          }
        }
      },
      'StringArray' => {
        'type' => 'Array',
        'schema' => {
          'type' => 'String'
        },
        'default' => %w[item1 item2]
      },
      'ComponentArray' => {
        'type' => 'Array',
        'schema' => {
          'type' => 'Component'
        }
      },
      'StringArrayNoDefault' => {
        'type' => 'Array',
        'schema' => {
          'type' => 'String'
        }
      },
      'item' => {
        'type' => 'Array',
        'schema' => {
          'type' => 'Hash',
          'schema' => {
            'items' => {
              'type' => 'Array',
              'schema' => {
                'type' => 'String'
              }
            },
            'display' => {
              'type' => 'String'
            }
          }
        }
      }
    }
  end

  context 'iterate_properties' do
    it 'should iterate assets' do
      output = []
      IterateReferenceProperty.iterate(
        'item', @reference_properties['item'], nil, @reference_properties
      ) do |_key, property, _prop, _parent|
        output << property['type']
      end

      expect(output).to eq(
        %w[String Array String Hash Array]
      )
    end

    it 'should iterate assets and props' do
      output = []
      props = [
        { 'items' => %w[String1:1 String1:2], 'display' => 'display1' },
        { 'items' => %w[String2:1 String2:2], 'display' => 'display2' }
      ]
      IterateReferenceProperty.iterate(
        'item', @reference_properties['item'], props, @reference_properties
      ) do |_key, _property, prop, _parent|
        output << prop
      end

      expect(output).to eq(
        [
          'String1:1',
          'String1:2',
          %w[String1:1 String1:2],
          'display1',
          { 'items' => %w[String1:1 String1:2], 'display' => 'display1' },
          'String2:1',
          'String2:2',
          %w[String2:1 String2:2],
          'display2',
          { 'items' => %w[String2:1 String2:2], 'display' => 'display2' },
          [
            { 'items' => %w[String1:1 String1:2], 'display' => 'display1' },
            { 'items' => %w[String2:1 String2:2], 'display' => 'display2' }
          ]
        ]
      )
    end
  end
end
