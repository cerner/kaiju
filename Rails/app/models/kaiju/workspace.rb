# Public: A Workspace model
module Kaiju
  class Workspace
    include Redis::Objects
    include Kaiju::BaseModel
    include Kaiju::WorkspaceChangeManagement

    attr_reader :id

    value :creation_date_time

    value :update_date_time

    value :author

    value :name

    value :component

    counter :stack_index

    list :changes_stack, marshal: true

    set :collaborators

    set :projects

    value :inactive, marshal: true

    def initialize(id)
      @id = id
    end

    def as_json(options = {})
      json_representation(options)
    end

    def destroy
      Component.valid_object(component, &:destroy)
      delete!
    end

    def editors
      collaborators.value << author.value
    end

    def add_collaborators(inviter_id, collaborator_ids)
      return unless editors.include? inviter_id
      collaborator_ids.each { |collaborator_id| collaborators << collaborator_id }
    end

    def inactivate
      inactive.value = true
      expire(30.days)
      Component.valid_object(component, &:inactivate)
    end

    def request_inactivation
      inactivate if Project.valid_objects(projects) { |project| project unless project.inactive? }.empty?
    end

    def activate
      inactive.value = false
      persist
      Component.valid_object(component, &:activate)
    end

    def ast
      {
        'id' => id,
        'name' => name.value,
        'properties' => Component.valid_object(component, &:ast)['properties']
      }
    end
  end
end
