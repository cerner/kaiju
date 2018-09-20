require 'kaiju/property'
require 'composed_id_util'
require 'iterate_property'

module Kaiju
  class PropertyFactory
    include ComposedIdUtil

    def self.update_property(type, property, value)
      if type == 'insert_after' then property.insert(value, 'after' => true)
      elsif type == 'insert_before' then property.insert(value)
      elsif type == 'append' then property.append(value)
      elsif type == 'update' then property.update(value)
      elsif type == 'destroy' then property.destroy
      end
    end

    def self.transform_properties(props, properties, parent = {}, &block)
      transformed_properties = {}
      properties&.each do |key, property|
        transformed_properties[key] = transform_prop(key, props[key], property, parent, &block)
      end
      transformed_properties
    end

    def self.transform_prop(key, prop, property, parent, &block)
      transformed_prop = {}
      transformed_prop['id'] = compose_id(key, parent['id'])
      transformed_prop['type'] = property['type']
      transformed_prop['value'] = build_transformed_value(transformed_prop, prop, property, &block)
      yield(transformed_prop) if block
      transformed_prop
    end

    def self.build_transformed_value(transformed_prop, prop, property, &block)
      return prop if prop.nil?

      if property['type'] == 'Array'
        build_transformed_array_value(transformed_prop, prop, property, &block)
      elsif property['type'] == 'Hash'
        build_transformed_hash_value(transformed_prop, prop, property, &block)
      else
        prop
      end
    end

    def self.build_transformed_array_value(transformed_prop, prop, property, &block)
      return unless prop.is_a? Array

      prop.each_with_index.map do |item, index|
        transform_prop(index, item, property['schema'], transformed_prop, &block)
      end.compact
    end

    def self.build_transformed_hash_value(transformed_prop, prop, property, &block)
      return unless prop.is_a? Hash

      transform_properties(prop, property['schema'], transformed_prop, &block)
    end

    def self.rebuild_child_ids(property)
      IterateProperty.iterate_children(
        property, IterateProperty.method(:iterate_execute_parent_first)
      ) do |key, child_property, parent, _child_output|
        child_property['id'] = compose_id(key, parent['id'])
      end
    end
  end
end
