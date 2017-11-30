require 'kaiju/property'
class PropertiesController < ApplicationController
  include PropertiesHelper
  before_action :fetch_objects
  before_action { fetch_workspace(params[:workspace_id]) }
  before_action except: [:show] { authorize(params[:workspace_object].editors) }
  # GET /projects/1/workspaces/1/components/1/properties/1
  def show
    render json: Kaiju::PropertyJson.to_json(
      params[:property_object].id,
      request.base_url,
      component_id: params[:component_id],
      workspace_id: params[:workspace_id],
      project_id: params[:project_id],
      user_id: current_user.id
    )
  end

  def update
    property_id = update_property(params)

    render json: Kaiju::PropertyJson.to_json(
      property_id,
      request.base_url,
      component_id: params[:component_id],
      workspace_id: params[:workspace_id],
      project_id: params[:project_id],
      user_id: current_user.id
    )
  end

  def destroy
    destroy_property(params[:workspace_object], params[:property_object])
    head :ok
  end

  def fetch_objects
    component = Kaiju::Component.by_id(params[:component_id])

    property = Kaiju::Property.by_id(CGI.unescape(params[:id]), component)

    not_found unless component && property

    params[:component_object] = component
    params[:property_object] = property
  end
end
