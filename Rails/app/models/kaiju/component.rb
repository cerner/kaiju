require 'iterate_property'
require 'component_information'

# Public: A Component model
module Kaiju
  class Component
    include Redis::Objects
    include Kaiju::BaseModel

    attr_reader :id

    value :creation_date_time

    value :update_date_time

    value :parent

    value :type

    value :properties, marshal: true

    value :inactive, marshal: true

    value :properties_timestamp

    def initialize(id)
      @id = id
    end

    def as_json(options = {})
      json_representation(options)
    end

    def inactivate
      inactive.value = true
      expire(30.days)
      child_components(&:inactivate)
    end

    def activate
      inactive.value = false
      persist
      child_components(&:activate)
    end

    def child_components(&block)
      child_components = []
      IterateProperty.iterate_properties(properties.value) do |_key, property, _parent, _child_output|
        component = Component.by_property(property)
        next if component.nil?
        child_components.concat(component.child_components(&block))
        component = yield(component) if block_given?
        child_components << component unless component.nil?
      end
      child_components
    end

    def self.by_property(property)
      return unless property['type'] == 'Component' && property['value'].is_a?(Hash)
      Component.by_id(property&.dig('value', 'id'))
    end

    def clean_properties
      child_components(&:destroy)
    end

    def generate_props
      {
        'id' => id,
        'type' => type.value,
        'props' => Component.generate_props_for_properties(properties.value)
      }
    end

    def generate_change(action)
      { action: action, props: generate_props }
    end

    def generate_props_for_properties(&block)
      Component.generate_props_for_properties(properties.value, &block)
    end

    def self.generate_props_for_properties(properties)
      IterateProperty.iterate_properties(properties) do |key, property, parent, child_output|
        yield(key, property, parent, child_output) if block_given?
        Property.generate_prop(property, child_output)
      end
    end

    def ast
      info = ComponentInformation.info(type)
      {
        'id' => id,
        'name' => info&.dig('name'),
        'code_name' => info&.dig('code_name'),
        'type' => type.value,
        'import' => info&.dig('import'),
        'import_from' => info&.dig('import_from'),
        'properties' => Property.properties_ast(properties.value)
      }
    end

    def destroy
      clean_properties
      delete!
    end

    def current_schema?
      properties_timestamp.value == ComponentInformation.info(type)&.dig('timestamp')
    end
  end
end
