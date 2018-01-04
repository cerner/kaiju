require 'id_generator'
require 'kaiju/component'
require 'kaiju/property'
require 'kaiju/property_factory'
require 'component_information'
require 'prop_placeholder_util'

module Kaiju
  class ComponentFactory
    def self.new_placeholder(id, project_type)
      new_component(project_type, 'kaiju::Placeholder', { 'text' => 'Placeholder' }, id)
    end

    def self.reset_component(component)
      if component.type.value == 'kaiju::Workspace'
        update_component(component, 'kaiju::Workspace', nil)
      else
        update_component(component, 'kaiju::Placeholder', 'text' => 'Placeholder')
      end
    end

    def self.new_workspace_component(project_type)
      new_component(project_type, 'kaiju::Workspace', nil)
    end

    def self.new_component(project_type, type, props, id = nil, parent = nil)
      unless ComponentInformation.component_exists?(type)
        Rails.logger.error "Component of type: #{type} failed to create."
        # TODO: Return error component once one is created.
        return new_placeholder(id, project_type)
      end
      component = Component.new(id || IdGenerator.generate_id)
      component.creation_date_time = Time.now.iso8601_precise
      component.parent = parent unless parent.nil?
      component.project_type = project_type
      update_component(component, type, props)
    end

    def self.update_component(component, type, props)
      component.clean_properties
      component.type = type
      update_properties(component, type, props)
      component.update_date_time = Time.now.iso8601_precise
      component
    end

    def self.update_properties(component, type, props)
      component_information = ComponentInformation.info(type)
      properties = component_information['properties']
      props = props.nil? ? component_information['defaults'] : inject_placeholder_props(props, properties)
      component.properties = PropertyFactory.transform_properties(
        props, properties
      ) do |property|
        expand_property(property, component.id, component.project_type.value)
      end
      component.properties_timestamp = component_information['timestamp']
    end

    def self.inject_placeholder_props(props, properties)
      updated_props = {}
      properties.each do |key, property|
        updated_props[key] = PropPlaceholderUtil.inject_placeholders(property, props[key])
      end
      updated_props
    end

    def self.expand_property(property, parent, project_type)
      return unless property['type'] == 'Component'
      component = property['value']
      return unless component.is_a?(Hash)
      property['value'] = {
        'id' => new_component(project_type, component['type'], component['props'], component['id'], parent).id
      }
    end

    def self.rebuild_properties(component)
      update_component(component, component.type.value, component.generate_props_for_properties)
    end
  end
end
