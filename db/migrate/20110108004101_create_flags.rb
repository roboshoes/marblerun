class CreateFlags < ActiveRecord::Migration
  def self.up
    create_table :flags do |t|
      t.string :hash

      t.timestamps
    end

    add_index :flags, :hash, { :name => 'flag_hash_index', :unique => true }
  end

  def self.down
    remove_index :flags, :flag_hash_index

    drop_table :flags
  end
end
