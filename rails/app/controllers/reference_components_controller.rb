require 'component_information'

class ReferenceComponentsController < ApplicationController
  # GET /reference_components
  def index
    Rails.logger.debug params

    render json: JSON.pretty_generate(ComponentInformation.sorted_components)
  end
end
