require 'json'
require 'composed_id_util'
require 'prop_placeholder_util'
require 'iterate_reference_property'
require 'ice_nine'

class ComponentInformation # rubocop:disable Metrics/ClassLength
  include ComposedIdUtil
  # Public
  #
  # library - The String library name containing the component
  # component - The String component name
  #
  # Returns a Hash containing all the information of a component
  def self.info(id)
    ids = decompose_id(id)
    components.dig(*ids)
  end

  # Public
  #
  # library - The String library name containing the component
  # component - The String component name
  #
  # Returns a Hash containing all the component properties
  def self.properties(id)
    info(id)['properties']
  end

  def self.property_schema(id, schema_id)
    iterate_composed_id(schema_id, info(id)&.dig('properties')) do |ids, object, item_id|
      item = object&.dig(item_id)
      unless ids.empty?
        ids[0] = 'schema' if item&.dig('type') == 'Array'
        ids.unshift('schema') if item&.dig('type') == 'Hash'
      end
      item
    end
  end

  # Public: Returns a Hash of all components
  def self.components
    @cached_components ||= IceNine.deep_freeze(Hash[gather_components(sources)])
  end

  def self.component_exists?(id)
    !info(id).nil?
  end

  # Public: Returns an Array of all components sorted into categories
  def self.sorted_components
    @sorted_components ||= sort_components
  end

  def self.sources
    sources = []
    JSON.parse(File.read('whitelist.json')).each do |library|
      Dir[Rails.root.join("client/node_modules/#{library['name']}/kaiju/**/*.json")].each do |file|
        sources << [library, file]
      end
    end
    Dir[Rails.root.join('lib/kaiju/**/*.json')].each do |file|
      sources << [{ 'name' => 'kaiju' }, file]
    end
    sources
  end

  # Private: Reads in all the Kaiju JSON files defined in the whitelist
  def self.gather_components(sources)
    components_hash = Hash.new { |hash, key| hash[key] = {} }
    sources.each do |library, file|
      begin
        add_component(components_hash, library, JSON.parse(File.read(file)))
      rescue StandardError => exception
        Rails.logger.debug "Exception : #{exception}\n Library #{library}\n File #{file}\n"
      end
    end
    components_hash
  end

  def self.add_component(hash, library, component)
    setup_basic_component_info(component, library)
    component['timestamp'] = Time.now.iso8601_precise

    component_valid, reason = transform_component(component)
    component['defaults'] = create_defaults(component)

    if component_valid
      hash[component['library']][component['name']] = component
    else
      Rails.logger.debug "Invalid Component: #{component['name']}\n  Reason: #{reason}"
    end
  end

  def self.setup_basic_component_info(component, library)
    component['library'] = library['name'] unless component.key? 'library'
    source_library = component['library']
    setup_code_name_and_import(component)

    component['import_from'] ||= component['library']
    component['id'] = compose_id(component['name'], source_library)
  end

  def self.setup_code_name_and_import(component)
    if component.key?('import')
      component['code_name'] = component['import'] + '.' + component['name']
    else
      component['code_name'] = component['name']
      component['import'] = component['name']
    end
  end

  def self.create_defaults(component)
    defaults = {}
    component['properties']&.each do |key, property|
      default = PropPlaceholderUtil.inject_placeholders(property, property['default'])
      defaults[key] = default unless default.nil?
    end
    defaults
  end

  def self.transform_component(component)
    errors = []
    IterateReferenceProperty.iterate_properties(component['properties'], nil, component) do |key, property, _props, _p|
      validate_type(key, property, errors)

      property['form_type'] ||= property['type']
      validate_form_type(key, property, errors)
    end
    [errors.empty?, errors.join(",\n    ")]
  end

  def self.validate_type(key, property, errors)
    types = %w[Bool String Component Hash Array Number]
    return if types.include?(property['type'])
    errors << "Bad type, #{property['type']}, for #{key}"
  end

  def self.validate_form_type(key, property, errors)
    types = %w[Bool String Component Hash Array Number URLForm ColorPicker DatePicker CodifiedList DelayedInput]
    return if types.include?(property['form_type'])
    errors << "Bad form type, #{property['form_type']}, for #{key}"
  end

  # Private: Sorts the components by the type defined in each JSON, defaults to Other
  def self.sort_components
    sort = proc do |array|
      array.sort_by! { |item| item[:display] }
      array.each { |item| sort.call(item[:children]) if item[:children] }
    end
    sort.call(collect_components)
  end

  # Private: Collects all the available reference components
  def self.collect_components
    items = []
    components.each do |library, modules|
      modules.each_value do |attributes|
        next if attributes['hidden']
        insert_component(items, format_component(library, attributes), attributes['group'] || 'Other')
      end
    end
    items
  end

  # Private: Inserts a component into the appropriate location
  #
  # array - The Array being inspected
  # component - A Hash representing the component
  # group - The target group of the component
  def self.insert_component(array, component, group)
    return array << component if group.empty?
    section = group.split('::')
    current_group = section.shift
    array.each do |item|
      return insert_component(item[:children], component, section.join('::')) if item[:display] == current_group
    end
    array << { display: current_group, children: insert_component([], component, section.join('::')) }
  end

  # Private: Formats the information needed to build each component
  #
  # library - The String library name containing the component
  # data - A Hash representing the component
  #
  # Returns a Hash containing the formatted component information
  def self.format_component(library, data)
    { display: data['display'] || data['name'], name: data['name'], description: data['description'], library: library }
  end

  # private_class_method :gather_components, :sort_components, :format_component
end
