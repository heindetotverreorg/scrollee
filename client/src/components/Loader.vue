<template>
    <div class="loader">
        <!-- Add your loader content here -->
         <div v-for="instance of instances" :key="instance" class="loader-instance">
            <div class="skeleton">
                <div class="skeleton-header"></div>
                <div class="skeleton-content">
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line"></div>
                    <div class="skeleton-line short"></div>
                </div>
                <div class="skeleton-footer">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-info">
                        <div class="skeleton-name"></div>
                        <div class="skeleton-date"></div>
                    </div>
                </div>
            </div>
         </div>
    </div>
</template>

<script setup lang="ts">
const instances = Array.from({ length: 3 }, (_, i) => i + 1);
</script>

<style scoped>
.skeleton {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
}

.skeleton-header {
    height: 24px;
    background: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 16px;
}

.skeleton-content {
    margin-bottom: 16px;
}

.skeleton-line {
    height: 12px;
    background: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 8px;
}

.skeleton-line.short {
    width: 60%;
}

.skeleton-footer {
    display: flex;
    align-items: center;
}

.skeleton-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e0e0e0;
    margin-right: 12px;
}

.skeleton-info {
    flex: 1;
}

.skeleton-name {
    height: 12px;
    background: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 8px;
    width: 120px;
}

.skeleton-date {
    height: 10px;
    background: #e0e0e0;
    border-radius: 4px;
    width: 80px;
}
</style>