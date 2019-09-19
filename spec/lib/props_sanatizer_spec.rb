require 'rails_helper'
require 'props_sanatizer'

describe PropsSanatizer do
  context 'sanatize_props' do
    it 'removes ids' do
      ComponentInformationSpecHelper.reset_component_information(
        [
          [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
        ]
      )

      component = Kaiju::ComponentFactory.new_component('blarg', 'property::Example', nil)

      props = {
        'Component' => {
          'id' => 'derp',
          'type' => 'property::Example',
          'props' => {
            'Component' => {
              'id' => 'derp',
              'type' => 'kaiju::Placeholder'
            },
            'Display' => 'Display'
          }
        }
      }

      PropsSanatizer.sanatize_props(component, props)

      expect(props).to eq(
        'Component' => {
          'type' => 'property::Example',
          'props' => {
            'Component' => {
              'type' => 'kaiju::Placeholder'
            },
            'Display' => 'Display'
          }
        }
      )

      component.destroy
    end

    it 'does not blow up on a nil prop' do
      ComponentInformationSpecHelper.reset_component_information(
        [
          [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_component_for_sanatization.json']
        ]
      )

      component = Kaiju::ComponentFactory.new_component('blarg', 'property::Example', nil)

      props = {
        'Display' => 'Display'
      }

      PropsSanatizer.sanatize_props(component, props)

      expect(props).to eq(
        'Display' => 'Display'
      )

      component.destroy
    end
  end
end
