# Public: A Workspace model
# require 'babel/transpiler'
# require "execjs"

module Kaiju
  class WorkspaceCode
    # def self.generate_preview(workspace)
    #   response = HTTParty.get(
    #     Rails.configuration.x.preview_url,
    #     query: { 'ast' => CGI.escape(workspace.ast.to_json) },
    #     format: :json
    #   )

    #   response['preview']
    # end
    ESCAPE_MAP = {
      '\\'    => '\\\\',
      '</'    => '<\/',
      "\r\n"  => '\n',
      "\n"    => '\n',
      "\r"    => '\n',
      '"'     => '\"',
      "'"     => "'",
      '#'     => '\\#',
      '{'     => '\{',
      '}'     => '\}'
    }.freeze

    def self.generate_code(workspace)
      imports = Set.new
      code = generate_children(workspace[:properties][:children], imports)
      file = File.read('lib/templates/functional_template.txt')
      file.gsub!('<=ComponentName=>', generate_component_name(workspace[:name].to_s))
      file.gsub!('<=Imports=>', imports.to_a.join)
      file.gsub!('<=Code=>', code.indent(2))
    end

    def self.generate_component_name(name)
      name.match(/\A[a-zA-Z]\w*\z/).nil? ? 'Workspace' : name
    end

    def self.generate_children(children, imports)
      return '' unless children
      return children[:value] if children[:type] == 'String'
      return "\n#{generate_component(children[:value], imports)}" if children[:type] == 'Component'
      children[:value].collect { |child| "\n#{generate_component(child[:value], imports)}".indent(2) }.join
    end

    def self.generate_component(component, imports) # rubocop:disable Metrics/AbcSize
      return component[:properties][:text][:value] if component[:type] == 'kaiju::Text'
      component_name = component[:code_name]
      imports.add("import #{component[:import]} from '#{component[:import_from]}';\n")
      children = generate_children(component[:properties][:children], imports)

      props = component[:properties].reject { |key, _value| key == :children }.collect do |key, value|
        prop = generate_prop(value, imports)
        value[:type] == 'String' ? "#{key}=#{prop}" : "#{key}={#{prop}}"
      end.join(' ')

      suffix = children.blank? ? ' />' : ">#{children}\n</#{component_name}>"
      "<#{component_name} #{props}#{suffix}"
    end

    def self.generate_prop(item, imports) # rubocop:disable all
      return if item.nil?
      if item[:type] == 'Array'
        generate_array_prop(item, imports)
      elsif item[:type] == 'Hash'
        generate_hash_prop(item, imports)
      elsif item[:type] == 'Component'
        generate_component(item[:value], imports)
      elsif item[:type] == 'Bool' || item[:type] == 'Number'
        generate_bool_prop(item)
      elsif item[:type] == 'String'
        generate_string_prop(item)
      end
    end

    def self.generate_array_prop(item, imports)
      "[#{item[:value].collect { |object| generate_prop(object, imports) }.join(', ')}]"
    end

    def self.generate_hash_prop(item, imports)
      "{#{item[:value].collect { |key, value| "#{key}: #{generate_prop(value, imports)}" }.join(', ')}}"
    end

    def self.generate_bool_prop(item)
      item[:value].to_s
    end

    def self.generate_string_prop(item)
      '"' + item[:value].gsub(
        /(\\|<\/|\r\n|#|'|\342\200\250|\342\200\251|[\n\r"]|}|{)/u # rubocop:disable all
      ) { |match| ESCAPE_MAP[match] } + '"'
    end
  end
end
