const axios = require('axios');
const qs = require('qs');

const article = {
    title: 'From Manual Mayhem to Button Clicks: Automating Infrastructure at Scale',
    description: 'Learn how I automated a major infrastructure upgrade using Ansible, GitHub Actions, and Apache Traffic Control. A technical deep-dive into DevOps automation.',
    author: 'AdminOwl',
    category: 'DevOps',
    tags: 'Ansible, Infrastructure, Automation, GitHub Actions, Linux',
    markdown: `# From Manual Mayhem to Button Clicks: Automating Infrastructure at Scale

**Author**: AdminOwl | **Published**: February 2026 | **Read Time**: 8 min | **Tags**: Ansible, Infrastructure, DevOps, Automation

## The Setup

When I jumped into a CDN infrastructure team role in the Summer of 2023, I thought I knew what I was getting into: Ansible, Apache Traffic Control (ATC), and some infrastructure automation. What I *actually* got was a deep dive into a technology stack that would make even seasoned DevOps engineers sweat:

- **Ansible** (with its delightful YAML and variable hierarchy mysteries)
- **GitHub** (for version control, discussions, and existential questions)
- **ATC** (Apache Traffic Control—shaping CDN traffic with the finesse of a sledgehammer at first)
- **InfluxDB** (storing metrics while I questioned my life choices)
- **Slack Automation** (because alerts need personality)
- **ELK Stack** (Elasticsearch, Logstash, Kibana—the debugging trifecta)
- **Artifactory** (for storing things we build)
- **GitHub Actions** (CI/CD that actually works, mostly)

Oh, and security compliance. Always security compliance.

## The Pain Point: CentOS 7 to Rocky Linux 9

Imagine this: Your entire infrastructure is running on CentOS 7. Support ending December 2024. You need to upgrade to Rocky Linux 9 **while maintaining security compliance across the entire infrastructure AND the code**.

And you're not talking about five servers. You're talking about *dozens* of edge servers, caching infrastructure, and configuration management systems—all interdependent, all critical.

**Before Automation**: The upgrade was a manual, terrifying process - 4-6 hours per upgrade cycle, manual verification, sleepless nights

**After Automation**: 30 minutes, automated compliance checks, Slack notifies the team when it's done

## The Solution: Infrastructure as Code

The breakthrough came when we built an Ansible playbook that could handle the entire upgrade lifecycle:

\`\`\`yaml
---
- name: CentOS 7 to Rocky Linux 9 Migration
  hosts: edge_servers
  become: yes
  vars:
    distro_version: rocky_9
    compliance_check: true
  
  tasks:
    - name: Pre-upgrade validation
      block:
        - name: Check current OS
          debug:
            msg: "Currently running {{ ansible_distribution }} {{ ansible_distribution_version }}"
        
        - name: Validate compliance baseline
          shell: /usr/local/bin/compliance-check.sh
          register: baseline
          failed_when: baseline.rc != 0
    
    - name: System upgrade
      block:
        - name: Back up critical configs
          copy:
            src: /etc/nginx/
            dest: /backup/nginx-backup-{{ ansible_date_time.iso8601 }}/
            remote_src: yes
        
        - name: Install Rocky Linux repos
          yum:
            name: rocky-release
            state: present
        
        - name: Perform dist-upgrade
          shell: dnf distro-sync -y
          async: 3600
          poll: 30
    
    - name: Post-upgrade validation
      block:
        - name: Verify system health
          stat:
            path: /etc/redhat-release
          register: redhat_file
        
        - name: Run compliance checks
          shell: /usr/local/bin/compliance-check.sh
          register: post_upgrade
          failed_when: post_upgrade.rc != 0
        
        - name: Notify Slack on completion
          slack:
            token: "{{ slack_token }}"
            channel: "#infrastructure"
            msg: "✅ {{ inventory_hostname }} upgraded to Rocky Linux 9 successfully"
\`\`\`

## GitHub Actions Pipeline

To coordinate deployments across our infrastructure:

\`\`\`yaml
name: Infrastructure Upgrade Pipeline

on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'

jobs:
  pre-flight:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Validate Ansible playbooks
        run: |
          ansible-playbook playbooks/upgrade.yml --syntax-check
          ansible-lint playbooks/upgrade.yml
  
  upgrade:
    needs: pre-flight
    runs-on: ubuntu-latest
    strategy:
      matrix:
        server: [edge-1, edge-2, edge-3, edge-4]
    steps:
      - uses: actions/checkout@v3
      
      - name: Run upgrade playbook
        run: |
          ansible-playbook playbooks/upgrade.yml \\
            -i inventory/\${{ github.event.inputs.environment }} \\
            -l \${{ matrix.server }}
  
  post-deploy-tests:
    needs: upgrade
    runs-on: ubuntu-latest
    steps:
      - name: Smoke tests
        run: |
          curl -f http://edge-servers/health || exit 1
          echo "All systems operational"
\`\`\`

## ATC Configuration Example

Managing traffic during upgrades:

\`\`\`bash
# ATC Traffic Router configuration
{
  "name": "edge-upgrade-pool",
  "deliveryServices": {
    "origin-tier": {
      "active": true,
      "weight": 100
    }
  },
  "origins": [
    {
      "name": "edge-1",
      "status": "OFFLINE",
      "weight": 0
    },
    {
      "name": "edge-2",
      "status": "REPORTED",
      "weight": 50
    }
  ]
}
\`\`\`

This configuration allows traffic shifting during upgrades—offline servers get 0% traffic while upgraded servers ramp back up gradually.

## Key Takeaways

✅ **Automation wins don't happen overnight** — we spent months learning, failing, and iterating
✅ **Variable hierarchy is your friend** — document it religiously
✅ **Compliance isn't a roadblock, it's a feature** — bake it into your playbooks
✅ **The button is the goal** — infrastructure that runs itself
✅ **Code review infrastructure changes just like application code** — catches errors early
✅ **Monitor, alert, and automate recovery** — make the system self-healing`,
    published: 'on'
};

axios.post('http://127.0.0.1:5000/articles', qs.stringify(article), {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    maxRedirects: 0
})
    .then(response => {
        console.log('Article created successfully');
        console.log('Status:', response.status);
        console.log('Redirect Location:', response.headers.location);
    })
    .catch(error => {
        if (error.response && error.response.status === 302) {
            console.log('Article created successfully! Redirect Location:', error.response.headers.location);
        } else {
            console.error('Error creating article:', error.response ? error.response.data : error.message);
        }
    });