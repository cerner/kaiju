# Public: A Component model
require 'kaiju/component_factory'
require 'component_information'
require 'composed_id_util'
require 'iterate_property'
require 'prop_placeholder_util'

module Kaiju
  class Property # rubocop:disable Metrics/ClassLength
    include ComposedIdUtil
    attr_reader :id
    attr_reader :component
    attr_reader :property
    attr_reader :parent_property
    attr_reader :last_key
    attr_reader :all_properties

    def initialize(id, component)
      @id = id
      @component = component
      @all_properties = component.properties.value
      @property, @last_key, @parent_property = self.class.find_property(id, @all_properties)
      @schema = {}
    end

    def self.by_id(id, component)
      property = new(id, component)
      property.property.nil? ? nil : property
    end

    def schema(id)
      @schema[id] ||= ComponentInformation.property_schema(@component.project_type.value, @component.type.value, id)
    end

    def self.clean_properties(property)
      IterateProperty.iterate(nil, property, nil) do |_key, child_property, _parent, _child_output|
        next unless child_property['type'] == 'Component'

        Component.by_property(child_property)&.destroy
        child_property['value'] = nil
      end
    end

    def update_prop_setup(key, prop, schema, parent)
      # Inject placeholders in property to be added.
      prop = PropPlaceholderUtil.inject_placeholders(schema, prop)

      # transform the passed in props to the format we like and create new components
      PropertyFactory.transform_prop(key, prop, schema, parent || {}) do |property|
        ComponentFactory.expand_property(property, @component.id, @component.project_type.value)
      end
    end

    def write_property_changes_to_database
      component.properties = all_properties
      component.update_date_time = Time.now.iso8601_precise
    end

    def update(prop)
      if update_with_drop_zone?(prop)
        update_component_prop(prop)
      else
        update_standard_prop(prop)
      end

      write_property_changes_to_database
      id
    end

    def update_with_drop_zone?(prop)
      @property['type'] == 'Component' &&
        (schema(id).fetch('drop_zone', true) || (@property&.fetch('value', 'id') && !prop.nil?))
    end

    def update_standard_prop(prop)
      # delete any would be orphaned components
      Property.clean_properties(@property)

      # transform the passed in props to the format we like and create new components
      transformed_prop = update_prop_setup(@last_key, prop, schema(@id), @parent_property)

      if @parent_property.nil?
        # just update value if a root property
        @property['value'] = transformed_prop['value']
      else
        # update the value of the parent if a nested property
        @parent_property['value'][last_key] = transformed_prop
        @property = transformed_prop
      end
    end

    def update_component_prop(prop)
      if prop.nil?
        ComponentFactory.reset_component(Component.by_id(@property['value']['id']))
        # destroy_component_prop(prop)
      else
        # For components we can just update them in place.
        ComponentFactory.update_component(Component.by_id(@property['value']['id']), prop['type'], prop['props'])
      end
    end

    def destroy_component_prop(prop)
      if schema(id).fetch('drop_zone', true)
        ComponentFactory.reset_component(Component.by_id(@property['value']['id']))
      else
        update_standard_prop(prop)
      end
    end

    def insert(prop, options = {})
      # Arrays only, all you other components can get out
      return nil unless @parent_property&.dig('value').is_a?(Array)

      # transform the passed in props to the format we like and create new components
      transformed_prop = update_prop_setup(@last_key, prop, schema(@id), @parent_property)
      # determine if we insert before or after
      index = options['after'] ? last_key + 1 : last_key
      # insert the value into the parent array
      @parent_property['value'].insert(index, transformed_prop)
      # all the ids for the parent property need to be rebuilt
      PropertyFactory.rebuild_child_ids(@parent_property)
      # we reset the property in question to the new property
      @property = transformed_prop
      # now we write the changes to the database
      write_property_changes_to_database
      inserted_id(index)
    end

    def inserted_id(index)
      @parent_property['value'][index]['id']
    end

    def append(prop)
      return nil unless @property['type'] == 'Array'

      value = @property['value'] || []
      key = value.count
      new_item_id = self.class.compose_id(key, @id)
      transformed_prop = update_prop_setup(key, prop, schema(new_item_id), @property)
      @property['value'] = value << transformed_prop
      write_property_changes_to_database
      new_item_id
    end

    def destroy
      parent_value = @parent_property&.dig('value')
      # don't delete the last item in an array.
      if parent_value.is_a?(Array) && parent_value.count > 1
        destroy_array_element_property(parent_value)
      else
        update(nil)
      end
      nil
    end

    def destroy_array_element_property(parent_value)
      Property.clean_properties(@property)
      parent_value.delete_at(last_key)
      PropertyFactory.rebuild_child_ids(@parent_property)
      write_property_changes_to_database
    end

    def as_json(_options = {})
      property
    end

    def self.generate_props(property)
      IterateProperty.iterate(nil, property, nil) do |_key, child_property, _parent, child_output|
        generate_prop(child_property, child_output)
      end
    end

    def self.generate_prop(property, child_output)
      component = Component.by_property(property)
      if component.nil?
        child_output.nil? ? property['value'] : child_output
      else
        component.generate_props
      end
    end

    def generate_change(type)
      if type == 'append' then generate_append_change
      elsif type == 'insert_after' then generate_insert_after_change
      elsif type == 'insert_before' then generate_insert_before_change
      elsif type == 'update' then generate_update_change
      elsif type == 'destroy' then generate_destroy_change
      end
    end

    def generate_append_change
      { property_id: id, action: 'append', props: Property.generate_props(property['value'].last) }
    end

    def generate_insert_after_change
      {
        property_id: id,
        action: 'insert_after',
        props: Property.generate_props(parent_property['value'][last_key + 1])
      }
    end

    def generate_insert_before_change
      { property_id: id, action: 'insert_before', props: Property.generate_props(property) }
    end

    def generate_update_change
      { property_id: id, action: 'update', props: Property.generate_props(property) }
    end

    def generate_destroy_change
      { property_id: id, action: 'destroy' }
    end

    def generate_undo_change(type)
      if type == 'append' then generate_inverse_append_change
      elsif type == 'insert_after' then generate_inverse_insert_after_change
      elsif type == 'insert_before' then generate_destroy_change
      elsif type == 'update' then generate_update_change
      elsif type == 'destroy' then generate_inverse_destroy_change
      end
    end

    def generate_inverse_append_change
      { property_id: Property.compose_id(property['value'].length, id), action: 'destroy' }
    end

    def generate_inverse_insert_after_change
      { property_id: Property.compose_id(last_key + 1, parent_property['id']), action: 'destroy' }
    end

    def generate_inverse_destroy_change
      parent_value = @parent_property&.dig('value')
      if parent_value.is_a?(Array) && parent_value.count > 1
        generate_inverse_destroy_change_for_arrays(parent_value)
      else
        { property_id: id, action: 'update', props: Property.generate_props(property) }
      end
    end

    def generate_inverse_destroy_change_for_arrays(parent_value)
      action = 'insert_before'
      change_id = id
      if parent_value.count == last_key + 1
        change_id = Property.compose_id(last_key - 1, parent_property['id'])
        action = 'insert_after'
      end
      { property_id: change_id, action: action, props: Property.generate_props(property) }
    end

    def self.properties_ast(properties)
      hash = IterateProperty.iterate_properties(properties) do |_key, property, _parent, child_output|
        property_ast(property, child_output)
      end
      hash&.delete_if { |_key, value| value.nil? }
      hash
    end

    def self.property_ast(property, child_output)
      if property['type'] == 'Component'
        property['value'] = component_property_ast(property)
      elsif property['type'] == 'Array'
        property['value'] = array_property_ast(child_output)
      elsif property['type'] == 'Hash'
        property['value'] = hash_property_ast(child_output)
      end
      property['value'].nil? ? nil : property
    end

    def self.component_property_ast(property)
      component = Component.by_property(property)
      return nil if component.nil? || component.type.value == 'kaiju::Placeholder'

      component.ast
    end

    def self.array_property_ast(child_output)
      child_output&.compact!
      return nil if child_output&.empty?

      child_output
    end

    def self.hash_property_ast(child_output)
      child_output&.delete_if { |_key, value| value.nil? }
      return nil if child_output&.empty?

      child_output
    end

    def self.find_property(id, properties)
      parent_property = nil
      last_key = nil
      property = nil
      iterate_composed_id(id, properties) do |_ids, object, property_id|
        parent_property = property
        property = object[property_id]
        last_key = property_id
        property&.dig('value')
      end
      [property, last_key, parent_property]
    end
  end
end
