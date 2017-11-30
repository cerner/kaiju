require 'rails_helper'
require 'id_generator'

describe IdGenerator do
  context 'generate_id' do
    it 'should create a new unique id' do
      expect(IdGenerator.generate_id).not_to eq(IdGenerator.generate_id)
    end
  end

  context 'object_name' do
    it 'should create a unique name' do
      expect(IdGenerator.object_name).not_to eq(IdGenerator.object_name)
    end
  end

  context 'nouns' do
    it 'should load a list of nouns once' do
      IdGenerator.instance_variable_set(:@nouns, nil)
      nouns = %w[nounA nounB]
      expect(IdGenerator).to receive(:load_file).with('lib/nouns.txt').and_return(nouns)
      expect(IdGenerator.nouns).to eq(nouns)
      expect(IdGenerator).not_to receive(:load_file)
      expect(IdGenerator.nouns).to eq(nouns)
    end
  end

  context 'adjectives' do
    it 'should load a list of adjectives' do
      IdGenerator.instance_variable_set(:@adjectives, nil)
      adjectives = %w[adjectiveA adjectivesB]
      expect(IdGenerator).to receive(:load_file).with('lib/adjectives.txt').and_return(adjectives)
      expect(IdGenerator.adjectives).to eq(adjectives)
      expect(IdGenerator).not_to receive(:load_file)
      expect(IdGenerator.adjectives).to eq(adjectives)
    end
  end

  context 'load_file' do
    it 'should load a file' do
      adjectives = IdGenerator.load_file('lib/adjectives.txt')
      expect(adjectives).to include('autumn', 'frosty', 'nameless')
    end
  end
end
