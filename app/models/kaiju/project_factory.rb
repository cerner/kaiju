require 'id_generator'
require 'kaiju/project'
require 'kaiju/user'
require 'kaiju/workspace_factory'

module Kaiju
  class ProjectFactory
    def self.new_project(owner_id, type)
      project = Project.new(IdGenerator.object_name)
      user = User.by_id(owner_id)
      user.projects << project.id
      project.owner = owner_id
      project.name = 'Untitled Project'
      now = Time.now.iso8601_precise
      project.creation_date_time = now
      project.update_date_time = now
      project.type = type
      project
    end
  end
end
