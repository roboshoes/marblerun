class MarbleRun < ActiveRecord::Base
  def self.update_length length
    instance = MarbleRun.first

    if instance
      instance.total_length += length
      instance.save
    end
  end
end
