# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20201116090109) do

  create_table "flags", :force => true do |t|
    t.string   "hash"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "flags", ["hash"], :name => "flags_hash_key", :unique => true

  create_table "likes", :force => true do |t|
    t.string   "hash"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "likes", ["hash"], :name => "likes_hash_key", :unique => true

  create_table "marble_runs", :force => true do |t|
    t.float    "total_length"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tracks", :force => true do |t|
    t.text     "json"
    t.string   "username"
    t.string   "trackname"
    t.integer  "likes"
    t.integer  "flags"
    t.integer  "active",     :limit => 2
    t.float    "length"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.text     "imagedata"
    t.integer  "duration"
  end

  add_index "tracks", ["created_at"], :name => "tracks_created_at_idx"
  add_index "tracks", ["likes"], :name => "tracks_likes_idx"

  create_table "unlocks", :force => true do |t|
    t.integer  "minimum_length"
    t.string   "brick_type"
    t.integer  "is_unlocked",    :limit => 2
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
