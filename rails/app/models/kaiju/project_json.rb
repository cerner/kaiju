require 'kaiju/user'
require 'kaiju/project'
require 'kaiju/model_json'
require 'kaiju/workspace_json'

module Kaiju
  class ProjectJson < ModelJson
    def self.klass
      Project
    end

    def self.projects_as_json(user, base_url, options = {})
      map_ids(user.projects) { |id| as_json(id, base_url, options.merge(lite: true)) }
    end

    def self.projects_to_json(user, base_url, options = {})
      JSON.pretty_generate(projects_as_json(user, base_url, options))
    end

    def self.as_json_full(id, base_url, options = {})
      project = klass.by_id(id)
      user_id = options[:user_id]
      hash = project.as_json(options_with_except(options, %i[collaborators inactive]))

      hash['owner'] = UserJson.map_id(hash['owner']) { |owner_id| UserJson.as_json(owner_id, base_url, lite: true) }
      decorate_workspaces(hash, id, base_url, user_id)
      hash['is_editable'] = editable?(project, user_id)
      decorate_urls(hash, id, base_url)
      hash
    end

    def self.as_json_lite(id, base_url, _options = {})
      project = klass.by_id(id)
      hash = project.as_json(only: %i[name owner update_date_time type])
      hash['owner'] = UserJson.map_id(hash['owner']) { |owner_id| UserJson.as_json(owner_id, base_url, lite: true) }
      hash['workspace_count'] = project.workspaces.count
      decorate_urls(hash, id, base_url)
      hash
    end

    def self.decorate_workspaces(hash, project_id, base_url, user_id)
      hash['inactive_workspaces'] = WorkspaceJson.map_ids(hash['workspaces'], true) do |workspace_id|
        WorkspaceJson.as_json(workspace_id, base_url, project_id: project_id, user_id: user_id)
      end
      hash['workspaces'] = WorkspaceJson.map_ids(hash['workspaces']) do |workspace_id|
        WorkspaceJson.as_json(workspace_id, base_url, project_id: project_id, user_id: user_id)
      end
    end

    def self.decorate_urls(hash, project_id, base_url) # rubocop:disable Metrics/AbcSize
      hash['url'] = base_url + project_path(project_id)
      hash['workspaces_url'] = base_url + project_workspaces_path(project_id)
      hash['reference_components_url'] = base_url + reference_components_project_path(project_id)
      hash['rename_url'] = base_url + name_project_path(project_id)
      hash['collaboration_invitation_url'] = base_url + collaboration_invitation_project_path(project_id)
      hash['activate_url'] = base_url + activate_project_path(project_id)
      hash['changelog_viewed'] = base_url + changelog_viewed_project_path(project_id)
    end

    def self.editable?(project, user_id)
      project.editors.include? user_id
    end
  end
end
