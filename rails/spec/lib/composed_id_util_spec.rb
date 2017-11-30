require 'rails_helper'

module Kaiju
  describe ComposedIdUtil do
    let(:dummy_class) { Class.new { include ComposedIdUtil } }
    # before(:context) do
    #   @project_key = 'idk'
    #   @project = project.new(idk)
    # end
    context 'iterate_composed_id' do
      it 'should return the last item with a key' do
        id = 'derp'
        target = 'target'
        object = { 'derp' => target }
        response = dummy_class.iterate_composed_id(id, object)
        expect(response).to eq(target)
      end

      it 'should return a nested item with a key' do
        id = 'herp::derp'
        target = 'target'
        object = { 'herp' => { 'derp' => target } }
        response = dummy_class.iterate_composed_id(id, object)
        expect(response).to eq(target)
      end

      it 'should return a nested item with a key including arrays' do
        id = 'herp::1::derp'
        target = 'target'
        object = { 'herp' => ['junk', { 'derp' => target }] }
        response = dummy_class.iterate_composed_id(id, object)
        expect(response).to eq(target)
      end

      it 'should fire a block for each key' do
        id = 'herp::1::derp'
        ids = dummy_class.decompose_id(id)
        target = 'target'
        object = { 'herp' => ['junk', { 'derp' => target }] }
        dummy_class.iterate_composed_id(id, object) do |block_ids, _block_object, block_id, _block_item|
          id = ids.shift
          id = id.match?(/\A\d+\z/) ? id.to_i : id
          expect(block_ids).to eq(ids)
          expect(id).to eq(block_id)
        end
      end
    end

    context 'compose_id' do
      it 'combines the prefix with the id' do
        expect(dummy_class.compose_id('derp', 'herp')).to eq('herp::derp')
      end

      it 'turns integer ids to strings' do
        expect(dummy_class.compose_id(1, 'herp')).to eq('herp::1')
      end

      it 'returns just the id if no prefix is supplied' do
        expect(dummy_class.compose_id('derp')).to eq('derp')
      end
    end

    context 'decompose_id' do
      it 'returns a :: seperated id into parts' do
        expect(dummy_class.decompose_id('herp::derp::1')).to eq(%w[herp derp 1])
      end
    end

    context 'iterate_composed_ids' do
      it 'should return a nested item with a key' do
        ids = %w[herp derp]
        target = 'target'
        object = { 'herp' => { 'derp' => target } }
        response = dummy_class.iterate_composed_ids(ids, object)
        expect(response).to eq(target)
      end
    end
  end
end
