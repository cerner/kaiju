module Kaiju
  # Public: A User model
  class User
    include Redis::Objects
    include Kaiju::BaseModel

    attr_reader :id

    value :creation_date_time

    value :name

    value :email

    value :nickname

    sorted_set :recent_workspaces

    set :projects

    set :shared_projects

    value :inactive, marshal: true

    value :changelog_viewed, marshal: true

    # Public: Initialize a User.
    #
    # id - A String unique identifier
    # name - The String name of the User
    # email - The String email of the User
    # nickname - The String nickname of the User
    #
    # Examples
    #
    #   User.new(uid: 'xxx', info: { name: 'John Smith', email: 'John.Smith@Email.com', nickname: 'Johnny' })
    #

    def initialize(id)
      @id = id
    end

    def as_json(options = {})
      user = json_representation(options)
      user['recent_workspaces'] = recent_workspaces.members.reverse.map { |item| JSON.parse(item) }
      user['changelog_viewed'] = user['changelog_viewed'] == true
      user
    end

    def destroy
      delete!
    end

    def add_recent_workspace(project_id, workspace_id)
      if project_id && workspace_id
        recent_workspaces[{ project: project_id, workspace: workspace_id }.to_json] = Time.now.to_time.to_f
      end
      recent_workspaces.delete(recent_workspaces.first) if recent_workspaces.length > 51
    end
  end
end
