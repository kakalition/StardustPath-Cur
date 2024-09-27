package com.stardustpath.stardustpath.modules.auto.services;

import com.stardustpath.stardustpath.common.models.AutoCategoryParams;
import com.stardustpath.stardustpath.modules.auto.models.AutoAssetItemParams;
import com.stardustpath.stardustpath.modules.auto.models.AutoResult;
import com.stardustpath.stardustpath.modules.auto.repositories.AutoRepository;
import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;

@ApplicationScoped
public class AutoService {
    final AutoRepository repository;

    public AutoService(AutoRepository repository) {
        this.repository = repository;
    }

    @WithSession
    public Uni<List<AutoResult>> getCategories(AutoCategoryParams params) {
        return repository.findCategories(params);
    }

    @WithSession
    public Uni<List<AutoResult>> getAssetItems(AutoAssetItemParams params) {
        return repository.findAssetItems(params);
    }
}
