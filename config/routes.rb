Marblerun::Application.routes.draw do

  resources :tracks, :only => [:index, :create, :new, :show, :update] do 
    member do
      get 'previous', :action => 'previous'
      get 'next', :action => 'next'
      get 'previous/:sorting', :action => 'previous'
      get 'next/:sorting', :action => 'next'
    end

    collection do
      get 'info'
    end
  end

  # dirty hack to respond to OPTIONS request_method of XSS ajax calls
  controller :tracks do 
    match 'tracks' => :options_response
  end

  resources :unlocks, :only => [:index]

  controller :pages do
    match 'about' => :about
    match 'imprint' => :imprint
    match 'contact' => :contact
    match 'help' => :help
  end

  root :to => 'tracks#new'
end
