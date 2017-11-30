require 'rails_helper'

module Kaiju
  describe ModelJson do
    context 'valid?' do
      it 'returns active as valid' do
        user = UserFactory.new_user('derp')
        inactive = false
        expect(ModelJson.valid?(user, inactive)).to eq(true)
        user.destroy
      end

      it 'returns inactive as valid' do
        user = UserFactory.new_user('derp1')
        user.inactivate
        inactive = true
        expect(ModelJson.valid?(user, inactive)).to eq(true)
        user.destroy
      end

      it 'returns inactive as invalid' do
        user = UserFactory.new_user('derp2')
        user.inactivate
        inactive = false
        expect(ModelJson.valid?(user, inactive)).to eq(false)
        user.destroy
      end

      it 'returns nil object as invalid' do
        expect(ModelJson.valid?(nil, false)).to eq(false)
      end
    end
  end
end
