require 'rails_helper'

module Kaiju # rubocop:disable Metrics/ModuleLength
  describe WorkspaceCode do
    context 'generate_prop' do
      it 'returns nil if the item is nil' do
        expect(Kaiju::WorkspaceCode.generate_prop(nil, nil)).to be_nil
      end

      it 'returns the items value if a string' do
        item = {
          type: 'String',
          value: 'value'
        }

        expect(Kaiju::WorkspaceCode.generate_prop(item, nil)).to eq("\"#{item[:value]}\"")
      end

      it 'returns the bool value if a bool' do
        item = {
          type: 'Bool',
          value: true
        }

        expect(Kaiju::WorkspaceCode.generate_prop(item, nil)).to eq('true')
      end

      it 'returns an array of bools' do
        item = {
          type: 'Array',
          value: [
            {
              type: 'Bool',
              value: true
            },
            {
              type: 'Bool',
              value: false
            }
          ]
        }

        expect(Kaiju::WorkspaceCode.generate_prop(item, nil)).to eq('[true, false]')
      end

      it 'returns an array of numbers' do
        item = {
          type: 'Array',
          value: [
            {
              type: 'Number',
              value: 1
            },
            {
              type: 'Number',
              value: 1.1
            }
          ]
        }

        expect(Kaiju::WorkspaceCode.generate_prop(item, nil)).to eq('[1, 1.1]')
      end

      it 'returns an hash of bools' do
        item = {
          type: 'Hash',
          value: {
            value: {
              type: 'Bool',
              value: true
            },
            value2: {
              type: 'Bool',
              value: false
            }
          }
        }

        expect(Kaiju::WorkspaceCode.generate_prop(item, nil)).to eq('{value: true, value2: false}')
      end
    end

    context 'generate_component' do
      it 'returns a generated component' do
        item = {
          type: 'kaiju::component',
          name: 'thing',
          code_name: 'component.thing',
          import: 'component',
          import_from: '\lib\kaiju',
          properties: {
            children: {
              type: 'Array',
              value: [
                {
                  type: 'Component',
                  value: {
                    type: 'kaiju::child',
                    name: 'child',
                    code_name: 'child',
                    import: 'child',
                    import_from: 'kaiju',
                    properties: {}
                  }
                }
              ]
            },
            string_prop: {
              type: 'String',
              value: 'derp'
            },
            number_prop: {
              type: 'Number',
              value: 123
            }
          }
        }
        imports = Set.new
        expected_output = "<component.thing string_prop=\"derp\" number_prop={123}>\n  <child  />\n</component.thing>"
        expect(Kaiju::WorkspaceCode.generate_component(item, imports)).to eq(expected_output)
        expect(imports.to_a).to include("import component from '\\lib\\kaiju';\n")
        expect(imports.to_a).to include("import child from 'kaiju';\n")
      end

      it 'generates a component without children' do
        item = {
          type: 'kaiju::component',
          name: 'component',
          code_name: 'component',
          import: 'component',
          import_from: 'kaiju',
          properties: {
            string_prop: {
              type: 'String',
              value: 'derp'
            },
            number_prop: {
              type: 'Number',
              value: 123
            }
          }
        }
        imports = Set.new
        expected_output = '<component string_prop="derp" number_prop={123} />'
        expect(Kaiju::WorkspaceCode.generate_component(item, imports)).to eq(expected_output)
        expect(imports.to_a).to include("import component from 'kaiju';\n")
      end
    end

    context 'generate_code' do
      it 'generates code' do
        item = {
          name: 'comp_name',
          properties: {
            children: {
              type: 'Array',
              value: [
                {
                  type: 'Component',
                  value: {
                    type: 'kaiju::child',
                    name: 'child',
                    code_name: 'child',
                    import: 'child',
                    import_from: 'kaiju',
                    properties: {}
                  }
                }
              ]
            },
            string_prop: {
              type: 'String',
              value: 'derp'
            },
            number_prop: {
              type: 'Number',
              value: 123
            }
          }
        }
        code = "\n<child  />"
        file = File.read('lib/templates/functional_template.txt')
        file.gsub!('<=ComponentName=>', 'comp_name')
        file.gsub!('<=Imports=>', "import child from 'kaiju';\n")
        file.gsub!('<=Code=>', code.indent(4))

        expect(Kaiju::WorkspaceCode.generate_code(item)).to eq(file)
      end
    end
  end
end
