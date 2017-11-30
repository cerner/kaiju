require 'kaiju/user'
require 'kaiju/workspace'
require 'kaiju/component'
require 'kaiju/model_json'

module Kaiju
  class WorkspaceJson < ModelJson
    def self.klass
      Workspace
    end

    def self.workspaces_as_json(project, base_url, options = {})
      map_ids(project.workspaces) { |id| as_json(id, base_url, options.merge(project_id: project.id)) }
    end

    def self.workspaces_to_json(project, base_url, options = {})
      JSON.pretty_generate(workspaces_as_json(project, base_url, options))
    end

    def self.as_json_full(id, base_url, options = {})
      workspace = klass.by_id(id)
      project_id = options[:project_id]
      hash = workspace.as_json(
        options_with_except(options, %i[inactive stack_index changes_stack collaborators projects])
      )

      map_related_models(hash, id, project_id, base_url)
      decorate_urls(hash, workspace, project_id, base_url)
      hash['is_editable'] = editable?(workspace, options[:user_id])
      hash
    end

    def self.as_json_lite(id, base_url, options = {})
      workspace = klass.by_id(id)
      hash = workspace.as_json(only: %i[name author update_date_time])
      hash['author'] = UserJson.map_id(hash['author']) { |author_id| UserJson.as_json(author_id, base_url, lite: true) }
      decorate_urls(hash, workspace, options[:project_id], base_url)
      hash
    end

    def self.decorate_urls(hash, workspace, project_id, base_url) # rubocop:disable Metrics/AbcSize
      ids = [project_id, workspace.id]
      hash['url'] = base_url + project_workspace_path(*ids)
      hash['rename'] = base_url + name_project_workspace_path(*ids)
      hash['undo_url'] = base_url + undo_project_workspace_path(*ids)
      hash['redo_url'] = base_url + redo_project_workspace_path(*ids)
      hash['collaboration_invitation'] = base_url + collaboration_invitation_project_workspace_path(*ids)
      hash['activate'] = base_url + activate_project_workspace_path(*ids)

      url = Rails.configuration.x.use_node_server ? Rails.configuration.x.node_server_url : base_url

      hash['preview_url'] = url + preview_project_workspace_path(*ids)
      hash['code_url'] = base_url + code_project_workspace_path(*ids)
    end

    def self.map_related_models(hash, workspace_id, project_id, base_url)
      hash['author'] = UserJson.map_id(hash['author']) { |id| UserJson.as_json(id, base_url, lite: true) }
      hash['component'] = ComponentJson.map_id(hash['component']) do |id|
        ComponentJson.as_json(id, base_url, lite: true, project_id: project_id, workspace_id: workspace_id)
      end
    end

    def self.editable?(workspace, user_id)
      workspace.editors.include? user_id
    end

    def self.ast_as_json(id)
      klass.by_id(id).ast
    end

    def self.ast_to_json(id)
      JSON.pretty_generate(ast_as_json(id))
    end
  end
end
