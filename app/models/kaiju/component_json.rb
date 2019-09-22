require 'kaiju/component'
require 'kaiju/model_json'
require 'component_information'
require 'kaiju/property'
require 'kaiju/property_json'
require 'iterate_property'

module Kaiju
  class ComponentJson < ModelJson
    def self.klass
      Component
    end

    def self.as_json_full(id, base_url, options = {}) # rubocop:disable Metrics/AbcSize
      component = klass.by_id(id)
      user_id, workspace_id = get_ids(options)
      hash = component.as_json(options_with_except(options, %i[properties_timestamp]))
      decorate_component_info(hash)
      decorate_urls(hash, options.values_at(:project_id, :workspace_id) << component.id, base_url)
      decorate_properties(hash['properties'], options, component.id, base_url)
      hash['is_editable'] = editable?(workspace_id, user_id)
      hash
    end

    def self.get_ids(options)
      [options[:user_id], options[:workspace_id]]
    end

    def self.as_json_lite(id, base_url, options = {})
      component = klass.by_id(id)
      {
        'id' => component.id,
        'url' => base_url + project_workspace_component_path(options[:project_id], options[:workspace_id], id)
      }
    end

    def self.decorate_properties(properties, options, component_id, base_url)
      IterateProperty.iterate_properties(properties) do |_key, property, parent, _child_output|
        PropertyJson.decorate_json(property, parent, options.merge(component_id: component_id), base_url)
      end
    end

    def self.editable?(workspace_id, user_id)
      Kaiju::Workspace.by_id(workspace_id).editors.include? user_id
    end

    def self.decorate_urls(hash, ids, base_url)
      hash['url'] = base_url + project_workspace_component_path(*ids)
    end

    def self.decorate_component_info(hash)
      info = ComponentInformation.info(hash['project_type'], hash['type'])
      hash['display'] = info&.dig('display')
      hash['name'] = info&.dig('name')
      hash['code_name'] = info&.dig('code_name')
    end
  end
end
