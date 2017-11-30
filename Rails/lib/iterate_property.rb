class IterateProperty
  def self.iterate_properties(properties, parent = {}, iterate_proc = method(:iterate), &block)
    output = {}
    return output if properties.nil?
    properties.each do |key, property|
      output[key] = iterate_proc.call(key, property, parent, &block)
    end
    output
  end

  def self.iterate(key, property, parent, &block)
    return if property.nil?
    child_output = iterate_children(property, &block)
    yield(key, property, parent, child_output)
  end

  def self.iterate_execute_parent_first(key, property, parent, &block)
    return if property.nil?
    yield(key, property, parent)
    iterate_children(property, method(:iterate_execute_parent_first), &block)
  end

  def self.iterate_children(property, iterate_proc = method(:iterate), &block)
    return nil if property['value'].nil?
    if property['type'] == 'Array'
      property['value'].each_with_index.map do |item, index|
        iterate_proc.call(index, item, property, &block)
      end
    elsif property['type'] == 'Hash'
      iterate_properties(property['value'], property, iterate_proc, &block)
    end
  end
end
