class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  before_action :authenticate

  include ::SessionsHelper

  # Internal: Redirects to provided open id authentication
  def authenticate
    redirect_to("/auth?origin=#{request.original_url}") unless current_user
  end

  def authorize(editors)
    forbidden unless editors.include? current_user.id
  end

  def fetch_workspace(id)
    workspace = Kaiju::Workspace.by_id(id)
    not_found unless workspace
    params[:workspace_object] = workspace
  end

  def fetch_component(id)
    component = Kaiju::Component.by_id(id)
    Kaiju::ComponentFactory.rebuild_properties(component) unless component.current_schema?
    not_found unless component
    params[:component_object] = component
  end

  def fetch_project(id)
    project = Kaiju::Project.by_id(id)
    not_found unless project
    params[:project_object] = project
  end

  def forbidden
    head :forbidden
  end

  def not_found
    raise(ActionController::RoutingError.new('Not Found'), 'resource not found')
  end
end
