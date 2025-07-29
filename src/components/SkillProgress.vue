<template>
  <div class="skill-progress-container">
    <div class="skill-header">
      <span class="skill-name">{{ skill.name }}</span>
      <span class="skill-percentage">{{ displayedLevel }}%</span>
    </div>
    <div class="skill-bar-container">
      <div 
        class="skill-bar-background"
        :class="`skill-${skill.category}`"
      >
        <div 
          class="skill-bar-fill"
          :class="`skill-${skill.category}`"
          :style="{ width: displayedLevel + '%' }"
        ></div>
      </div>
    </div>
    <div class="skill-description" v-if="skill.description">
      {{ skill.description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

// 技能类型定义
type SkillCategory = 'language' | 'framework' | 'tool' | 'database' | 'other'

interface Skill {
  name: string
  level: number
  category: SkillCategory
  description?: string
}

interface Props {
  skill: Skill
  animated?: boolean
  delay?: number
}

const props = withDefaults(defineProps<Props>(), {
  animated: true,
  delay: 0
})

const displayedLevel = ref(0)

// 动画函数
const animateProgress = () => {
  if (!props.animated) {
    displayedLevel.value = props.skill.level
    return
  }

  const duration = 1000 // 1秒动画
  const steps = 60 // 60帧
  const increment = props.skill.level / steps
  let currentStep = 0

  const timer = setInterval(() => {
    currentStep++
    displayedLevel.value = Math.min(currentStep * increment, props.skill.level)
    
    if (currentStep >= steps) {
      clearInterval(timer)
      displayedLevel.value = props.skill.level
    }
  }, duration / steps)
}

// 监听技能变化
watch(() => props.skill.level, () => {
  displayedLevel.value = 0
  setTimeout(animateProgress, props.delay)
}, { immediate: false })

onMounted(() => {
  setTimeout(animateProgress, props.delay)
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
.skill-progress-container {
  margin-bottom: spacing(4);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: spacing(2);
}

.skill-name {
  font-size: font-size(base);
  font-weight: font-weight(medium);
  color: color(text-primary);
}

.skill-percentage {
  font-size: font-size(sm);
  font-weight: font-weight(semibold);
  color: color(primary);
}

.skill-bar-container {
  margin-bottom: spacing(1);
}

.skill-bar-background {
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: border-radius(full);
  overflow: hidden;
  position: relative;
}

.skill-bar-fill {
  height: 100%;
  border-radius: border-radius(full);
  transition: width 0.3s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 4px;
    height: 100%;
    background: rgba(255, 255, 255, 0.3);
    border-radius: border-radius(full);
  }
}

.skill-description {
  font-size: font-size(xs);
  color: color(text-muted);
  line-height: 1.75;
}

// 不同分类的颜色主题
.skill-language {
  .skill-bar-fill {
    background: linear-gradient(90deg, color(success), color.adjust(color(success), $lightness: 10%));
  }
  
  .skill-percentage {
    color: color(success);
  }
}

.skill-framework {
  .skill-bar-fill {
    background: linear-gradient(90deg, color(primary), color.adjust(color(primary), $lightness: 10%));
  }
  
  .skill-percentage {
    color: color(primary);
  }
}

.skill-tool {
  .skill-bar-fill {
    background: linear-gradient(90deg, color(warning), color.adjust(color(warning), $lightness: 10%));
  }
  
  .skill-percentage {
    color: color(warning);
  }
}

.skill-database {
  .skill-bar-fill {
    background: linear-gradient(90deg, color(danger), color.adjust(color(danger), $lightness: 10%));
  }
  
  .skill-percentage {
    color: color(danger);
  }
}

.skill-other {
  .skill-bar-fill {
    background: linear-gradient(90deg, color(info), color.adjust(color(info), $lightness: 10%));
  }
  
  .skill-percentage {
    color: color(info);
  }
}
</style>