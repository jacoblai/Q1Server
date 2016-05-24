namespace UploadDemo
{
    partial class Form1
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.lb_msg = new System.Windows.Forms.ListBox();
            this.bt_post = new System.Windows.Forms.Button();
            this.tb_key = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.tb_url = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // lb_msg
            // 
            this.lb_msg.Anchor = ((System.Windows.Forms.AnchorStyles)((((System.Windows.Forms.AnchorStyles.Top | System.Windows.Forms.AnchorStyles.Bottom) 
            | System.Windows.Forms.AnchorStyles.Left) 
            | System.Windows.Forms.AnchorStyles.Right)));
            this.lb_msg.FormattingEnabled = true;
            this.lb_msg.ItemHeight = 12;
            this.lb_msg.Location = new System.Drawing.Point(75, 84);
            this.lb_msg.Margin = new System.Windows.Forms.Padding(2);
            this.lb_msg.Name = "lb_msg";
            this.lb_msg.Size = new System.Drawing.Size(325, 244);
            this.lb_msg.TabIndex = 11;
            // 
            // bt_post
            // 
            this.bt_post.Location = new System.Drawing.Point(75, 61);
            this.bt_post.Margin = new System.Windows.Forms.Padding(2);
            this.bt_post.Name = "bt_post";
            this.bt_post.Size = new System.Drawing.Size(326, 18);
            this.bt_post.TabIndex = 10;
            this.bt_post.Text = "选择及提交图片";
            this.bt_post.UseVisualStyleBackColor = true;
            this.bt_post.Click += new System.EventHandler(this.bt_post_Click);
            // 
            // tb_key
            // 
            this.tb_key.Location = new System.Drawing.Point(75, 36);
            this.tb_key.Margin = new System.Windows.Forms.Padding(2);
            this.tb_key.Name = "tb_key";
            this.tb_key.Size = new System.Drawing.Size(327, 21);
            this.tb_key.TabIndex = 9;
            this.tb_key.Text = "3aa6bdfb-8b94-49e3-ad16-62bdc070f091";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(17, 38);
            this.label2.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(53, 12);
            this.label2.TabIndex = 8;
            this.label2.Text = "U-ApiKey";
            // 
            // tb_url
            // 
            this.tb_url.Location = new System.Drawing.Point(75, 8);
            this.tb_url.Margin = new System.Windows.Forms.Padding(2);
            this.tb_url.Name = "tb_url";
            this.tb_url.Size = new System.Drawing.Size(327, 21);
            this.tb_url.TabIndex = 7;
            this.tb_url.Text = "http://localhost:8080/api/upload/mf.jpg";
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(9, 10);
            this.label1.Margin = new System.Windows.Forms.Padding(2, 0, 2, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(65, 12);
            this.label1.TabIndex = 6;
            this.label1.Text = "传感器地址";
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(411, 347);
            this.Controls.Add(this.lb_msg);
            this.Controls.Add(this.bt_post);
            this.Controls.Add(this.tb_key);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.tb_url);
            this.Controls.Add(this.label1);
            this.Name = "Form1";
            this.Text = "Form1";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.ListBox lb_msg;
        private System.Windows.Forms.Button bt_post;
        private System.Windows.Forms.TextBox tb_key;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.TextBox tb_url;
        private System.Windows.Forms.Label label1;
    }
}

