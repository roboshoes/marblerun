class InitializeLength < ActiveRecord::Migration
  def self.up
    MarbleRun.new(:total_length => 0.0).save
  end

  def self.down
    MarbleRun.first.destroy
  end
end
