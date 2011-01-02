class CreateLikes < ActiveRecord::Migration
  def self.up
    create_table :likes do |t|
      t.string :hash

      t.timestamps
    end

    add_index :likes, :hash, { :name => 'hash_index', :unique => true }
  end

  def self.down
    remove_index :likes, :hash_index

    drop_table :likes
  end
end
