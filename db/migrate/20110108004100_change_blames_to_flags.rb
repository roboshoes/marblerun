class ChangeBlamesToFlags < ActiveRecord::Migration
  def self.up
    rename_column :tracks, :blames, :flags
  end

  def self.down
    rename_column :tracks, :flags, :blames
  end
end
