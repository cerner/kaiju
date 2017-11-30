require 'kaiju/property'
require 'component_information'
require 'kaiju/component_json'
require 'kaiju/component'
require 'iterate_property'

module Kaiju
  class PropertyJson < ModelJson
    def self.as_json(id, base_url, options = {})
      component_id = options[:component_id]
      hash = Property.by_id(id, Component.by_id(component_id)).as_json(options)
      IterateProperty.iterate(nil, hash, {}) do |_key, property, parent, _child_output|
        PropertyJson.decorate_json(
          property, parent, options, base_url
        )
      end
      hash
    end

    def self.decorate_json(property, parent, options, base_url)
      component_id = options[:component_id]
      decorate_urls(property, parent, [options[:project_id], options[:workspace_id], component_id], base_url)
      decorate_properties(property, component_id)
      decorate_component(property, options, base_url)
    end

    def self.decorate_urls(property, parent, ids, base_url)
      ids << CGI.escape(property['id'])
      property['url'] = base_url + project_workspace_component_property_path(*ids)
      decorate_append_url(property)
      decorate_insert_url(property, parent)
    end

    def self.decorate_append_url(property)
      property['append_url'] = property['url'] + '?append=true' if property['type'] == 'Array'
    end

    def self.decorate_insert_url(property, parent)
      return unless parent['type'] == 'Array'
      property['insert_before_url'] = property['url'] + '?insert_before=true'
      property['insert_after_url'] = property['url'] + '?insert_after=true'
    end

    def self.decorate_properties(property, component_id)
      component = Component.by_id(component_id)
      component_information = ComponentInformation.property_schema(
        component.type.value, property['id']
      )
      add_if_found(property, 'display', component_information)
      add_if_found(property, 'description', component_information)
      add_if_found(property, 'options', component_information)
      add_if_found(property, 'form_type', component_information)
      add_if_found(property, 'schema', component_information)
      property['hidden'] = component_information&.fetch('hidden', false)
    end

    def self.add_if_found(hash, key, source)
      hash[key] = source[key] if source&.include?(key)
    end

    def self.decorate_component(property, options, base_url)
      value = property['value']
      return unless property['type'] == 'Component' && !value.nil?
      property['value'] = ComponentJson.map_id(value['id']) do |id|
        ComponentJson.as_json(id, base_url, options.except(:component_id))
      end
    end
  end
end
