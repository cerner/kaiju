require 'rails_helper'
require 'prop_placeholder_util'

describe PropPlaceholderUtil do
  context 'placeholder_hash' do
    it 'should return a props placeholder structure' do
      expect(PropPlaceholderUtil.placeholder_hash).to eq(
        'type' => 'kaiju::Placeholder'
      )
    end
  end

  context 'inject_component_placeholder' do
    it 'returns a placeholder' do
      reference_property = {
        'type' => 'Component'
      }
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, nil)).to eq(
        PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a placeholder if not a Component' do
      reference_property = {
        'type' => 'derp'
      }
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, nil)).to eq(
        PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a placeholder if junk is supplied' do
      reference_property = {
        'type' => 'Component'
      }
      props = ['junk']
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, props)).to eq(
        PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a placeholder if a malformed component is supplied' do
      reference_property = {
        'type' => 'Component'
      }
      props = {
        'junk' => 'derp'
      }
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, props)).to eq(
        PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns default props if supplied' do
      reference_property = {
        'type' => 'Component'
      }
      props = {
        'type' => 'derp'
      }
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, props)).to eq(
        props
      )
    end

    it 'returns nil if drop_zone is false' do
      reference_property = {
        'type' => 'Component',
        'drop_zone' => false
      }
      expect(PropPlaceholderUtil.inject_component_placeholder(reference_property, nil)).to be_nil
    end
  end

  context 'inject_array_placeholders' do
    it 'returns an array with a placeholder' do
      reference_property = {
        'schema' => {
          'type' => 'Component'
        }
      }
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, nil)).to eq(
        [PropPlaceholderUtil.placeholder_hash]
      )
    end

    it 'returns an empty array with a nil object' do
      reference_property = {
        'schema' => {
          'type' => 'derp'
        }
      }
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, nil)).to eq(
        [nil]
      )
    end

    it 'returns an array with a placeholder' do
      reference_property = {
        'schema' => {
          'type' => 'Component'
        }
      }
      props = []
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, props)).to eq(
        [PropPlaceholderUtil.placeholder_hash]
      )
    end

    it 'returns an empty array with a nil object' do
      reference_property = {
        'schema' => {
          'type' => 'derp'
        }
      }
      props = []
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, props)).to eq(
        [nil]
      )
    end

    it 'returns an array with a placeholder when junk is supplied' do
      reference_property = {
        'schema' => {
          'type' => 'Component'
        }
      }
      props = { 'junk' => 'other junk' }
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, props)).to eq(
        [PropPlaceholderUtil.placeholder_hash]
      )
    end

    it 'creates placeholders for children' do
      reference_property = {
        'schema' => {
          'type' => 'Hash',
          'schema' => {
            'item' => {
              'type' => 'Component'
            },
            'color' => {
              'type' => 'text'
            }
          }
        }
      }
      props = [{ 'color' => 'green' }]
      expect(PropPlaceholderUtil.inject_array_placeholders(reference_property, props)).to eq(
        [{ 'color' => 'green', 'item' => PropPlaceholderUtil.placeholder_hash }]
      )
    end
  end

  context 'inject_hash_placeholders' do
    it 'returns a defaulted placeholder' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'Component'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      props = { 'color' => 'green' }
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, props)).to eq(
        'color' => 'green', 'item' => PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a defaulted placeholder when given nil props' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'Component'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      props = nil
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, props)).to eq(
        'item' => PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a defaulted placeholder when given an empty hash as props' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'Component'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      props = {}
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, props)).to eq(
        'item' => PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns an empty hash when no placeholder is present' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'derp'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      props = {}
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, props)).to eq(
        {}
      )
    end

    it 'returns an empty hash when no props are supplied' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'derp'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, nil)).to eq(
        {}
      )
    end

    it 'returns an empty hash with a hash is not supplied' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'derp'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      props = ['derp']
      expect(PropPlaceholderUtil.inject_hash_placeholders(reference_property, props)).to eq(
        {}
      )
    end
  end

  context 'inject_placeholders' do
    it 'returns a placeholder' do
      reference_property = {
        'type' => 'Component'
      }
      expect(PropPlaceholderUtil.inject_placeholders(reference_property, nil)).to eq(
        PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns a string' do
      reference_property = {
        'type' => 'String'
      }
      props = 'string'
      expect(PropPlaceholderUtil.inject_placeholders(reference_property, props)).to eq(
        props
      )
    end

    it 'returns a hash placeholder' do
      reference_property = {
        'type' => 'Hash',
        'schema' => {
          'item' => {
            'type' => 'Component'
          },
          'color' => {
            'type' => 'text'
          }
        }
      }
      expect(PropPlaceholderUtil.inject_placeholders(reference_property, nil)).to eq(
        'item' => PropPlaceholderUtil.placeholder_hash
      )
    end

    it 'returns an array placeholder' do
      reference_property = {
        'type' => 'Array',
        'schema' => {
          'type' => 'Component'
        }
      }
      expect(PropPlaceholderUtil.inject_placeholders(reference_property, nil)).to eq(
        [PropPlaceholderUtil.placeholder_hash]
      )
    end

    it 'does not add a placeholder for a no dropzone array' do
      reference_property = {
        'type' => 'Array',
        'schema' => {
          'type' => 'Component',
          'drop_zone' => false
        }
      }
      expect(PropPlaceholderUtil.inject_placeholders(reference_property, nil)).to eq(
        [nil]
      )
    end
  end
end
