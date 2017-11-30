require 'rails_helper'
require 'properties_helper'
module Kaiju # rubocop:disable Metrics/ModuleLength
  describe Workspace do
    context 'initialization' do
      # after(:example) do
      #   @workspace.redis.del(@workspace.redis_objects.keys.map { |k| @workspace.send(k) }.reject(&:nil?).map(&:key))
      # end
      it 'should initialize a workspace object with a predefined id' do
        id = 'unique'
        @workspace = Workspace.new(id)
        expect(@workspace.id).to eq(id)
      end
    end

    context 'as_json' do
      before(:example) do
        @id = 'unique'
        @workspace = Workspace.new(@id)

        @creation_date_time = 'creation_date_time'
        @workspace.creation_date_time = @creation_date_time

        @update_date_time = 'update_date_time'
        @workspace.update_date_time = @update_date_time

        @author = 'author'
        @workspace.author = @author

        @name = 'name'
        @workspace.name = @name

        @workspace.stack_index.increment

        @stack1 = '1'
        @stack2 = '2'
        @workspace.changes_stack << @stack1
        @workspace.changes_stack << @stack2

        @collaborator1 = '1'
        @collaborator2 = '2'
        @workspace.collaborators << @collaborator1
        @workspace.collaborators << @collaborator2
      end
      after(:example) do
        @workspace.redis.del(@workspace.redis_objects.keys.map { |k| @workspace.send(k) }.reject(&:nil?).map(&:key))
      end
      it 'should fetch all objects' do
        workspace_hash = @workspace.as_json
        expect(workspace_hash['id']).to eq(@id)
        expect(workspace_hash['creation_date_time']).to eq(@creation_date_time)
        expect(workspace_hash['update_date_time']).to eq(@update_date_time)
        expect(workspace_hash['author']).to eq(@author)
        expect(workspace_hash['name']).to eq(@name)
        expect(workspace_hash['stack_index']).to eq(1)
        expect(workspace_hash['changes_stack']).to eq([@stack1, @stack2])
        expect(workspace_hash['collaborators']).to eq([@collaborator1, @collaborator2])
      end
    end

    context 'destroy' do
      it 'destroys a workspace' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        workspace_id = workspace.id
        component_id = workspace.component.value

        workspace.destroy
        expect(Workspace.by_id(workspace_id)).to be_nil
        expect(Component.by_id(component_id)).to be_nil
      end
    end

    context 'create_change' do
      it 'creates a change object' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json']
          ]
        )

        id = 'display'

        component = Kaiju::ComponentFactory.new_component('property::Example', nil)

        property = Property.new(id, component)

        action = 'update'

        # props = 'matt is awesome'

        undo_change = Workspace.create_undo_change(component, property, action)
        redo_change = Workspace.create_redo_change(component, property, action)

        change = Workspace.create_change(component.id, redo_change, undo_change)

        expect(change).to eq(
          component_id: component.id,
          redo: {
            property_id: id,
            action: 'update',
            props: 'Display'
          },
          undo: {
            property_id: id,
            action: 'update',
            props: 'Display'
          }
        )

        component.destroy
      end
    end

    context 'add_change' do
      it 'adds a change to the workspace' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        property = Property.new('text', component)
        action = 'update'
        repsonse = workspace.add_change(component, property, action) do
          'response'
        end

        expect(repsonse).to eq('response')

        expect(workspace.stack_index.value).to eq(1)
        undo_change = Workspace.create_undo_change(component, property, action)
        redo_change = Workspace.create_redo_change(component, property, action)
        expect(workspace.changes_stack[0]).to eq(Workspace.create_change(component.id, redo_change, undo_change))

        workspace.destroy
      end

      it 'can only store 101 changes' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        ComponentFactory.update_component(component, 'text::Mock_text', {})
        property = Property.new('text', component)
        action = 'update'
        props = 'matt is awesome'

        (0..102).each do |count|
          props = 'matt is awesome' + count.to_s
          workspace.add_change(component, property, action) do
            Kaiju::PropertyFactory.update_property('update', property, props)
          end
        end

        expect(workspace.stack_index.value).to eq(101)
        expect(workspace.changes_stack.length).to eq(101)

        # undo_change = Workspace.create_undo_change(component, property, action)
        # redo_change = Workspace.create_redo_change(component, property, action)
        expect(workspace.changes_stack[0]).to eq(
          component_id: component.id,
          redo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome2'
          },
          undo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome1'
          }
        )
        expect(workspace.changes_stack[100]).to eq(
          component_id: component.id,
          redo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome102'
          },
          undo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome101'
          }
        )

        workspace.destroy
      end

      it 'removes the top of the stack if a change is added below' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        ComponentFactory.update_component(component, 'text::Mock_text', {})
        property = Property.new('text', component)
        action = 'update'
        props = 'matt is awesome'
        workspace.add_change(component, property, action) do
          Kaiju::PropertyFactory.update_property('update', property, props)
        end
        props1 = 'matt is awesome1'
        workspace.add_change(component, property, action) do
          Kaiju::PropertyFactory.update_property('update', property, props1)
        end

        workspace.undo_change
        property = Property.new('text', component)

        props2 = 'matt is awesome2'
        workspace.add_change(component, property, action) do
          Kaiju::PropertyFactory.update_property('update', property, props2)
        end

        expect(workspace.stack_index.value).to eq(2)
        expect(workspace.changes_stack[1]).to eq(
          component_id: component.id,
          redo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome2'
          },
          undo: {
            property_id: property.id,
            action: 'update',
            props: 'matt is awesome'
          }
        )

        workspace.destroy
      end
    end

    context 'undo_change' do
      it 'preforms a no-op if there are no changes to undo' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')

        expect(workspace.undo_change).to be_nil

        workspace.destroy
      end

      it 'steps back to the previous change' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'text::Mock_text')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        property = Property.new('text', component)

        original_value = property.property['value']

        props = 'matt is awesome'

        value = Class.new { include PropertiesHelper }.new.update_property_with_value(
          workspace, property, props, 'update' => 'true'
        )

        expect(value).to_not be_nil

        property = Property.new('text', component)

        expect(property.property['value']).to eq(props)

        expect(workspace.undo_change).to eq(component.id)

        property = Property.new('text', component)

        expect(property.property['value']).to eq(original_value)

        workspace.destroy
      end

      it 'undoes a component change' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'text::Mock_text')
        component_id = Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        component = Component.by_id(component_id)

        original_value = component.generate_change('update')

        props = {
          'type' => 'property::Example'
        }

        Class.new { include ComponentsHelper }.new.update_component(
          workspace, component, props
        )

        component = Component.by_id(component_id)

        expect(component.type.value).to eq('property::Example')

        expect(workspace.undo_change).to eq(component.id)

        component = Component.by_id(component_id)

        expect(component.generate_change('update')).to eq(original_value)

        workspace.destroy
      end
    end

    context 'redo_change' do
      it 're-executes the un done change' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'text::Mock_text')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        property = Property.new('text', component)

        original_value = property.property['value']

        props = 'matt is awesome'

        Class.new { include PropertiesHelper }.new.update_property_with_value(
          workspace, property, props, 'update' => 'true'
        )

        property = Property.new('text', component)

        expect(property.property['value']).to eq(props)

        workspace.undo_change

        property = Property.new('text', component)

        expect(property.property['value']).to eq(original_value)

        expect(workspace.redo_change).to eq(component.id)

        property = Property.new('text', component)

        expect(property.property['value']).to eq(props)

        workspace.destroy
      end

      it 're-executes the undone component change' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'text::Mock_text')
        component_id = Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        component = Component.by_id(component_id)

        original_value = component.generate_change('update')

        props = {
          'type' => 'property::Example'
        }

        Class.new { include ComponentsHelper }.new.update_component(
          workspace, component, props
        )

        component = Component.by_id(component_id)

        expect(component.type.value).to eq('property::Example')

        expect(workspace.undo_change).to eq(component.id)

        component = Component.by_id(component_id)

        expect(component.generate_change('update')).to eq(original_value)

        expect(workspace.redo_change).to eq(component.id)

        component = Component.by_id(component_id)

        expect(component.type.value).to eq('property::Example')

        workspace.destroy
      end

      it 'performs a no-op if we are set to the latest change' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'text::Mock_text')

        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )
        property = Property.new('text', component)

        props = 'matt is awesome'

        Class.new { include PropertiesHelper }.new.update_property_with_value(
          workspace, property, props, 'update' => 'true'
        )

        expect(workspace.redo_change).to be_nil

        workspace.destroy
      end

      it 'performs a no-op if there are no changes' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')

        expect(workspace.redo_change).to be_nil

        workspace.destroy
      end

      it 'succeeds to redo changes undone on a child component' do
        ComponentInformationSpecHelper.reset_component_information(
          [
            [{ 'name' => 'property' }, 'spec/lib/mock_data/mock_prop_generation_property.json'],
            [{ 'name' => 'text' }, 'spec/lib/mock_data/mock_text.json']
          ]
        )

        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        Property.new('children::0', Component.by_id(workspace.component.value)).update('type' => 'property::Example')
        component = Component.by_id(
          Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
        )

        array_property = Property.new('hash::array', component)

        Class.new { include PropertiesHelper }.new.update_property_with_value(
          workspace, array_property, { 'type' => 'text::Mock_text' }, 'append' => 'true'
        )

        array_item_property = Property.new('hash::array::1', component)

        array_item_component = Component.by_property(array_item_property.property)

        array_item_component_property = Property.new('text', array_item_component)

        Class.new { include PropertiesHelper }.new.update_property_with_value(
          workspace, array_item_component_property, 'matt is awesome', 'update' => 'true'
        )

        workspace.undo_change
        workspace.undo_change
        workspace.redo_change
        workspace.redo_change

        expect(
          Component.by_id(
            Property.new('children::0', Component.by_id(workspace.component.value)).property['value']['id']
          ).as_json
        ).to eq(component.as_json)

        workspace.destroy
      end
    end

    context 'editors' do
      it 'returns the author and empty contributors' do
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        expect(workspace.editors).to eq(['author'])
        workspace.destroy
      end

      it 'returns the author and collaborators' do
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        workspace.collaborators << 'derpface'
        expect(workspace.editors).to eq(%w[derpface author])
        workspace.destroy
      end
    end

    context 'add_collaborators' do
      it 'rejects an invitation made by a non editor' do
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        workspace.add_collaborators('derpface', ['old-man'])
        expect(workspace.collaborators.value).to eq([])
        workspace.destroy
      end

      it 'adds a collaborator' do
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        workspace.add_collaborators('author', ['old-man'])
        expect(workspace.collaborators.value).to eq(['old-man'])
        workspace.destroy
      end
    end

    context 'inactivate' do
      it 'inactivates itself and component' do
        ComponentInformationSpecHelper.reset_component_information([])
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        component = Kaiju::Component.by_id(workspace.component.value)

        workspace.inactivate
        expect(workspace.inactive.value).to be true
        expect(workspace.ttl).to be_within(5).of(30.days)
        expect(component.inactive.value).to be true
        expect(component.ttl).to be_within(5).of(30.days)

        component.destroy
        workspace.destroy
      end
    end

    context 'activate' do
      it 'activates itself and component' do
        ComponentInformationSpecHelper.reset_component_information([])
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')
        component = Kaiju::Component.by_id(workspace.component.value)

        workspace.inactivate
        workspace.activate
        expect(workspace.inactive.value).to be false
        expect(workspace.ttl).to eq(-1)
        expect(component.inactive.value).to be false
        expect(component.ttl).to eq(-1)

        component.destroy
        workspace.destroy
      end
    end

    context 'request_inactivation' do
      it 'inactivates if all containing projects are inactive' do
        user = Kaiju::UserFactory.new_user('owner')
        project = Kaiju::ProjectFactory.new_project(user.id)
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')

        project.inactivate
        expect(project.inactive?).to eq(true)
        workspace.projects << project.id

        workspace.request_inactivation
        expect(workspace.inactive?).to be true
        expect(workspace.ttl).to be_within(5).of(30.days)

        workspace.destroy
        project.destroy
        user.destroy
      end

      it 'does not inactivate if a containing project is inactive' do
        user = Kaiju::UserFactory.new_user('owner')
        project = Kaiju::ProjectFactory.new_project(user.id)
        project2 = Kaiju::ProjectFactory.new_project(user.id)
        workspace = Kaiju::WorkspaceFactory.new_workspace('author')

        project.inactivate
        expect(project.inactive?).to eq(true)
        workspace.projects << project.id
        workspace.projects << project2.id

        workspace.request_inactivation
        expect(workspace.inactive?).to be false
        expect(workspace.ttl).to eq(-1)

        workspace.destroy
        project.destroy
        project2.destroy
        user.destroy
      end
    end
  end
end
