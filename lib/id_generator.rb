class IdGenerator
  @nouns = nil
  @adjectives = nil

  def self.generate_id
    SecureRandom.uuid
  end

  def self.object_name
    sections = [
      IdGenerator.adjectives.sample,
      IdGenerator.nouns.sample,
      SecureRandom.urlsafe_base64(4)
    ]
    sections.compact.join('-')
  end

  def self.nouns
    @nouns ||= IdGenerator.load_file('lib/nouns.txt')
  end

  def self.adjectives
    @adjectives ||= IdGenerator.load_file('lib/adjectives.txt')
  end

  def self.load_file(file)
    array = []
    File.foreach(file) do |line|
      array << line.strip.downcase.gsub(/\s/, '-')
    end
    array
  end
end
