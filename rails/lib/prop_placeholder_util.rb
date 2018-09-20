class PropPlaceholderUtil
  def self.inject_placeholders(ref_property, prop)
    if ref_property['type'] == 'Array'
      inject_array_placeholders(ref_property, prop)
    elsif ref_property['type'] == 'Hash'
      inject_hash_placeholders(ref_property, prop)
    elsif ref_property['type'] == 'Component'
      inject_component_placeholder(ref_property, prop)
    else
      prop
    end
  end

  def self.inject_component_placeholder(ref_property, prop = nil)
    return prop if prop.is_a?(Hash) && prop.key?('type')

    ref_property.fetch('drop_zone', true) ? placeholder_hash : nil
  end

  def self.placeholder_hash
    { 'type' => 'kaiju::Placeholder' }
  end

  def self.inject_array_placeholders(ref_property, prop)
    if prop.is_a?(Array) && !prop.empty?
      prop.map { |item| inject_placeholders(ref_property['schema'], item) }
    else
      object = inject_placeholders(ref_property['schema'], nil)
      # object.nil? ? [] : [object]
      [object]
    end
  end

  def self.inject_hash_placeholders(ref_property, prop)
    default_prop = prop.is_a?(Hash) ? prop : {}
    ref_property['schema'].each do |key, item|
      object = inject_placeholders(item, default_prop[key])
      default_prop[key] = object unless object.nil?
    end
    default_prop
  end
end
