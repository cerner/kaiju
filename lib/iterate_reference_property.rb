class IterateReferenceProperty
  def self.iterate_properties(properties, props = nil, parent = {}, &block)
    properties&.each do |key, property|
      iterate(key, property, props&.dig(key), parent, &block)
    end
  end

  def self.iterate(key, property, prop, parent, &block)
    iterate_children(property, prop, &block)
    yield(key, property, prop, parent)
  end

  def self.iterate_children(property, prop, &block)
    if property['type'] == 'Array'
      if prop
        prop.each_with_index { |item, index|  iterate(index, property['schema'], item, property, &block) }
      else
        iterate(property, property['schema'], nil, property, &block)
      end
    elsif property['type'] == 'Hash'
      iterate_properties(property['schema'], prop, property, &block)
    end
  end
end
