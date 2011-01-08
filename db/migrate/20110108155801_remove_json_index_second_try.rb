class RemoveJsonIndexSecondTry < ActiveRecord::Migration
  def self.up
    remove_index :tracks, :name => 'json_index'
  end

  def self.down
    add_index :tracks, :json, { :name => 'json_index', :unique => true }
  end
end