class PropsSanatizer
  def self.sanatize_props(component, props)
    reference_properties = ComponentInformation.properties(component.type.value)
    IterateReferenceProperty.iterate_properties(reference_properties, props, nil) do |_key, property, prop, _parent|
      sanatize(property, prop)
    end
  end

  def self.sanatize_prop(component, property_id, prop)
    reference_property = ComponentInformation.property_schema(component.type.value, property_id)
    IterateReferenceProperty.iterate(nil, reference_property, prop, nil) do |_key, child_property, child_prop, _parent|
      sanatize(child_property, child_prop)
    end
  end

  def self.sanatize(property, prop)
    return if property['type'] != 'Component' || prop.nil?
    prop.delete('id')

    return unless prop.key?('props')
    reference_properties = ComponentInformation.properties(prop['type'])
    IterateReferenceProperty.iterate_properties(
      reference_properties, prop['props'], nil
    ) do |_key, child_property, child_prop, _parent|
      sanatize(child_property, child_prop)
    end
  end
end
