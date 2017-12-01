module Kaiju
  # Public: A Project model
  class Project
    include Redis::Objects
    include Kaiju::BaseModel

    attr_reader :id

    value :creation_date_time

    value :update_date_time

    value :owner

    value :name

    list :workspaces

    set :collaborators

    value :inactive, marshal: true

    def initialize(id)
      @id = id
    end

    def as_json(options = {})
      json_representation(options)
    end

    def editors
      collaborators.value << owner.value
    end

    def add_workspace(editor_id, workspace)
      workspaces << workspace.id
      workspace.add_collaborators(editor_id, collaborators.value)
      workspace.projects << id
    end

    def add_collaborators(inviter_id, collaborator_ids)
      return unless editors.include? inviter_id
      collaborator_ids.each do |collaborator_id|
        collaborators << collaborator_id
        collaborator = User.by_id(collaborator_id)
        collaborator&.shared_projects&.add(id)
      end
      Workspace.valid_objects(workspaces) do |workspace|
        workspace.add_collaborators(inviter_id, collaborator_ids)
      end
    end

    def inactivate
      inactive.value = true
      expire(30.days)
      Workspace.valid_objects(workspaces, &:request_inactivation)
    end

    def activate
      inactive.value = false
      persist
      Workspace.valid_objects(workspaces, &:activate)
    end

    def destroy
      delete!
    end
  end
end
