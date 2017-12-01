module Kaiju
  module WorkspaceChangeManagement
    def self.included(base)
      base.send :include, InstanceMethods
      base.extend ClassMethods
    end

    module InstanceMethods
      def add_change(component, property, action)
        undo_change = Workspace.create_undo_change(component, property, action)

        result = yield if block_given?

        redo_change = Workspace.create_redo_change(component, property, action)
        # stack_index.clear
        # changes_stack.clear
        manage_changes_stack

        update_date_time.value = Time.now.iso8601_precise
        changes_stack << Workspace.create_change(component.id, redo_change, undo_change)
        result
      end

      def manage_changes_stack
        if stack_index.value > 100
          changes_stack.shift
        else
          pop_invalidated_changes
          stack_index.increment
        end
      end

      def pop_invalidated_changes
        count_to_pop = changes_stack.length - stack_index.value
        changes_stack.pop(count_to_pop) if count_to_pop.positive?
      end

      def undo_changes?
        stack_index.value.positive?
      end

      def redo_changes?
        changes_stack.length >= stack_index.value + 1
      end

      def undo_change
        return unless undo_changes?
        stack_index.decrement
        change = changes_stack[stack_index.value]
        update_date_time.value = Time.now.iso8601_precise
        Workspace.execute_change(change[:component_id], change[:undo])
      end

      def redo_change
        return unless redo_changes?
        change = changes_stack[stack_index.value]
        stack_index.increment
        update_date_time.value = Time.now.iso8601_precise
        Workspace.execute_change(change[:component_id], change[:redo])
      end
    end

    module ClassMethods
      def create_change(id, redo_change, undo_change)
        {
          component_id: id,
          redo: redo_change,
          undo: undo_change
        }
      end

      def create_redo_change(component, property, action)
        if property
          property.generate_change(action)
        else
          component.generate_change(action)
        end
      end

      def create_undo_change(component, property, action)
        if property
          property.generate_undo_change(action)
        else
          component.generate_change('update')
        end
      end

      def execute_change(component_id, change)
        if change[:property_id].nil?
          ComponentFactory.update_component(
            Component.by_id(component_id), change[:props]['type'], change[:props]['props']
          )
        else
          property = Property.by_id(change[:property_id], Component.by_id(component_id))
          PropertyFactory.update_property(change[:action], property, change[:props])
        end
        component_id
      end
    end
  end
end
